module.exports={
    path: {
        type: 'string'
    },
    zipInfo: {
        type: 'object',
        properties: {
            android: {
                type: 'string',
                description: '最低依赖安卓版本'
            },
            iOS: {
                type: 'string',
                description: '最低依赖iOS版本'
            },
            appName: {
                type: 'string',
                description: 'appName'
            },
            jsVersion: {
                type: 'string',
                description: 'jsVersion'
            },
            timestamp: {
                type: 'integer',
                description: 'timestamp'
            }
        }
    }
}