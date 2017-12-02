module.exports = (fastify) => {
    require('./select')(fastify)
    require('./insert')(fastify)
    require('./check')(fastify)
    require('./delete')(fastify)
  }