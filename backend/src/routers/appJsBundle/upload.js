var pump = require('pump')
const fs = require('fs')
const Path = require('path')
const _ = require('lodash')
const AdmZip = require('adm-zip');
const responseSchema = require('../../responseSchema/upload')
const Util = require('./util')

function createUploadFilePath(appName, file, filename, mimetype) {
    let filePath = 'apk/full/' + appName + '/'
    Util.mkdirsSync(Path.join(Util.BaseUploadPath, filePath))

    filePath = Path.join(filePath, filename)
    return filePath
}

module.exports = (fastify) => {
    fastify.route({
        method: 'POST',
        url: '/apps/:id/jsbundle/upload',
        schema: {
            description: '上传APK文件',
            tags: ['app'],
            summary: '上传APK文件',
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer'
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: responseSchema
                }
            }
        },
        handler: async(request, reply) => {
            const app = await fastify.db.models.App.findById(request.params.id);

            if (app) {
                let filePath;
                const mp = request.multipart(handler, (err) => {})

                mp.on('field', function (key, value) {
                    console.log('form-data', key, value)
                })

                function handler(field, file, filename, encoding, mimetype) {
                    filePath = createUploadFilePath(app.appName, file, filename, mimetype)
                    var fileStream = fs.createWriteStream(Path.join(Util.BaseUploadPath, filePath))
                    pump(file, fileStream, err => {
                        if (!err) {
                            var zip = new AdmZip(Path.join(Util.BaseUploadPath, filePath));
                            const md5 = JSON.parse(zip.readAsText("md5.json"))
                            reply.send({
                                path: filePath,
                                zipInfo: md5
                            })
                        }
                    })
                }
            }else{
                reply.code(404)
            }
        }
    })


}