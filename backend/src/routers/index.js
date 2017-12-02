module.exports=(fastify)=>{
    require('./app')(fastify)
    require('./appJsBundle')(fastify)
}