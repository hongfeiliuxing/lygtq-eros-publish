module.exports={
    id:{
        type:'integer'
    },
    no:{
        type:'string'
    },
    iOS: {
        type: 'string',
        description: '最低依赖苹果版本'
    },
    android: {
        type: 'string',
        description: '最低依赖安卓版本'
    },
    jsVersion: {
        type: 'string',
        description: 'eros build 自动生成的jsVersion'
    },
    timestamp: {
        type: 'integer',
        allowNull: false
    },
    jsPath: {
        type: 'string',
        description: '包下载地址'
    },
    
}