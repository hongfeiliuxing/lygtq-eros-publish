module.exports = (fastify) => {
    require('./select')(fastify)
    require('./insert')(fastify)
    require('./upload')(fastify)
    require('./delete')(fastify)
  }