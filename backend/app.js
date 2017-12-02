const fastify = require('fastify')()
const serveStatic = require('serve-static')
const Path = require('path')
const Config = require('./config')
const Routers = require('./src/routers')

fastify.register(require('fastify-multipart'))
// 注册Sequelize插件
fastify.register(require('./src/plugins/sequelize'), Config.sequelize)
// 允许跨域
fastify.use(require('cors')())

// 注册路由
Routers(fastify)


fastify.ready(err => {
    if (err) throw err
})
fastify.use('/uploads', serveStatic(Path.resolve(__dirname, 'uploads')))

// 启动服务
fastify.listen(Config.port, function (err) {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
})