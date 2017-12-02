const AppJsBundleSchema = require('./appJsBundle')
module.exports = {
    id:{
        type:'integer'
    },
    name: {
        type: 'string',
        description: 'APP名称'
    },
    appName: {
        type: 'string',
        description: 'eros中的appName'
    },
    AppJsBundle: {
        type: 'array',
        items: {
            type: 'object',
            properties: AppJsBundleSchema
        }
    }
}