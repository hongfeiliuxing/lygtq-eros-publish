module.exports = (fastify) => {
    fastify.route({
        method: 'GET',
        url: '/check',
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    appName: {
                        type: 'string',
                        description: "app 名称"
                    },
                    jsPath: {
                        type: 'string',
                        description: "js bundle 下载路径，也就是 eros.dev.js 中的 diff.proxy"
                    },
                    iOS: {
                        type: 'string',
                        description: "ios 版本号"
                    },
                    android: {
                        type: 'string',
                        description: "android 版本号"
                    },
                    jsVersion: {
                        type: 'string',
                        description: 'APP中的js包的jsVersion'
                    },
                    isDiff: {
                        type: 'integer',
                        description: '是否差分更新'
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        resCode: {
                            type: 'integer'
                        },
                        msg: {
                            type: 'string'
                        },
                        data: {
                            type: 'object',
                            properties: {
                                isDiff: {
                                    type: 'boolean'
                                },
                                jsVersion: {
                                    type: 'string'
                                },
                                path: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        },
        handler: async(request, reply) => {
            const os = request.query.iOS ? 'iOS' : 'android'
            // 获取完整更新包
            const getFullZip = async() => {
                let where = {}
                where[os] = request.query[os]

                const appJsBundle = await fastify.db.models.AppJsBundle.findOne({
                    where,
                    include: [{
                        model: fastify.db.models.App,
                        where: {
                            appName: request.query.appName
                        }
                    }],
                    order: [
                        ['id', 'DESC']
                    ]
                })
                if (appJsBundle) {
                    if (appJsBundle.jsVersion !== request.query.jsVersion) {
                        return {
                            resCode: 0,
                            msg: "请求全量包成功",
                            data: {
                                isDiff: false,
                                path: 'http://' + (request.query.jsPath || request.headers.host) + '/uploads/' + appJsBundle.jsPath
                            }
                        }
                    } else {
                        return {
                            resCode: 4000,
                            msg: "APP中的已经是最新版"
                        }
                    }
                } else {
                    return {
                        resCode: 401,
                        msg: "未找到这个版本的全量包"
                    }
                }

            }

            // 获取差分包
            const getDiffZip = async() => {
                let where = {
                    jsVersion: request.query.jsVersion
                }
                where[os] = request.query[os]

                console.log(where)
                const appJsBundle = await fastify.db.models.AppJsBundle.findOne({
                    where,
                    include: [{
                        model: fastify.db.models.App,
                        where: {
                            appName: request.query.appName
                        }
                    }],
                })

                if (appJsBundle) {
                    // 获取该版本对应的最新差分包文件
                    const diff = await fastify.db.models.AppDiff.findOne({
                        where: {
                            os: os,
                            OldJsBundleId: appJsBundle.id
                        },
                        order: [
                            ['NewJsBundleId', 'DESC']
                        ]
                    })
                    // 找到最新差分包
                    if (diff) {
                        return {
                            resCode: 0,
                            msg: "当前版本需要更新",
                            data: {
                                isDiff: true,
                                jsVersion: diff.jsVersion,
                                path: 'http://' + (request.query.jsPath || request.headers.host) + '/uploads/' + diff.jsPath
                            }
                        }
                    } else {
                        return {
                            resCode: 4000,
                            msg: "当前版本无更新"
                        }
                    }
                } else {
                    // 返回这个系统版本的最新全量js
                    return await getFullZip()
                }
            }


            if (request.query.isDiff === 1) {
                return await getDiffZip()
            } else {
                return await getFullZip()
            }
        }
    })
}