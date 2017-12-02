const responseSchema = require('../../responseSchema/app')
const Path = require('path')
const Util = require('./util')
const fs = require('fs')
const MD5 = require('md5')
const Process = require('child_process')
/**
 * APP添加全量包
 * @param {*} fastify 
 */
module.exports = (fastify) => {
    fastify.route({
        method: 'POST',
        url: '/apps/:id/jsBundles',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'APP ID'
                    }
                }
            },
            body: {
                type: 'object',
                properties: {
                    no: {
                        type: 'string',
                        description: '全量包标识'
                    },
                    android: {
                        type: 'string',
                        description: '包依赖最低安卓版本'
                    },
                    iOS: {
                        type: 'string',
                        description: '包依赖最低iOS版本'
                    },
                    jsPath: {
                        type: 'string',
                        description: '包的下载地址'
                    },
                    jsVersion: {
                        type: 'string',
                        description: 'zip 包的版本号'
                    },
                    timestamp: {
                        type: 'integer',
                        description: '生成版本号时的时间戳'
                    }
                }
            },
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: responseSchema
                    }
                }
            }
        },
        handler: async(request, reply) => {
            const app = await fastify.db.models.App.findById(request.params.id);
            // 找到所有基于android最小版本的js包
            const androidList = await fastify.db.models.AppJsBundle.findAll({
                where: {
                    AppId: request.params.id,
                    android: request.body.android,
                    jsVersion:{
                        [fastify.db.sequelize.Op.ne]:request.body.jsVersion
                    }
                }
            })
            // 找到所有基于ios最小版本的js包
            const iosList = await fastify.db.models.AppJsBundle.findAll({
                where: {
                    AppId: request.params.id,
                    iOS: request.body.iOS,
                    jsVersion:{
                        [fastify.db.sequelize.Op.ne]:request.body.jsVersion
                    }
                }
            })

            const tran = await fastify.db.sequelize.transaction()
            try {

                const appJsBundle = await fastify.db.models.AppJsBundle.create({
                    AppId: request.params.id,
                    no: request.body.no,
                    iOS: request.body.iOS,
                    android: request.body.android,
                    jsVersion: request.body.jsVersion,
                    timestamp: request.body.timestamp,
                    jsPath: request.body.jsPath
                }, {
                    transaction: tran
                })

                const createDiffFiles = (baseDiffPath, oldJsBundle,os) => {
                    const diffFileSavePath = baseDiffPath + MD5(oldJsBundle.jsVersion + request.body.jsVersion) + '.zip';

                    const oldZipPath = Path.join(Util.BaseUploadPath, oldJsBundle.jsPath)
                    const newZipPath = Path.join(Util.BaseUploadPath, request.body.jsPath)
                    const diffZipPath = Path.join(Util.BaseUploadPath, diffFileSavePath)

                    return new Promise((resolve, reject) => {
                        Process.exec('bsdiff ' + oldZipPath + ' ' + newZipPath + ' ' + diffZipPath, (err, stdout, stderr) => {
                            if (err === null) {
                                fastify.db.models.AppDiff.create({
                                    os: os,
                                    jsPath: diffFileSavePath,
                                    OldJsBundleId: oldJsBundle.id,
                                    NewJsBundleId: appJsBundle.id
                                }, {
                                    transaction: tran
                                }).then(diff => {
                                    resolve(diff)
                                }).catch(error => {
                                    reject(error)
                                })
                            } else {
                                reject(new Error(`${filePath}与上传的包差分出错`))

                            }
                        })
                    })
                }
                // 区分安卓和苹果
                const promiseAndroid = androidList.map(oldJsBundle => {
                    const filePath = Path.join(Util.BaseUploadPath, oldJsBundle.jsPath)
                    const baseDiffPath = `apk/diff/${app.appName}/android/${request.body.android}/`
                    Util.mkdirsSync(Path.join(Util.BaseUploadPath, baseDiffPath))
                    if(fs.existsSync(filePath)){
                        return createDiffFiles(baseDiffPath, oldJsBundle,'android')
                    }
                })

                const promiseiOS = iosList.map(oldJsBundle => {
                    const filePath = Path.join(Util.BaseUploadPath, oldJsBundle.jsPath)
                    const baseDiffPath = `apk/diff/${app.appName}/iOS/${request.body.android}/`
                    Util.mkdirsSync(Path.join(Util.BaseUploadPath, baseDiffPath))
                    if(fs.existsSync(filePath)){
                        return createDiffFiles(baseDiffPath, oldJsBundle,'iOS')
                    }
                })

                Promise.all([...promiseAndroid, ...promiseiOS]).then(datas => {
                    tran.commit()
                    reply.send({})
                }).catch((error) => {
                    console.log(error)
                    tran.rollback();
                    reply.send({})
                })
            } catch (error) {
                console.log(error)
                tran.rollback();
                reply.send({})
            } 
        }
    })
}