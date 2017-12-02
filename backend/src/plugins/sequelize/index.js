const fp = require('fastify-plugin')
const Models = require('./models');
const Sequelize = require('sequelize')

const db = {};

db.configure = function (opts) {
  opts.sequelize = new Sequelize(opts.db.database, opts.db.user, opts.db.password, {
    host: opts.db.host,
    dialect: opts.db.dialect,
    pool: opts.db.pool,
    // logging:()=>{}
  })
  return opts.sequelize.authenticate()
    .then(() => {
      const files = Models.getFiles(opts.models);
      const models = Models.applyRelations(Models.load(files, opts.sequelize.import.bind(opts.sequelize)));
      return models;
    })
    .then((models) => {
      if (opts.sync) {
        return opts.sequelize.sync({
            force: opts.forceSync
          })
          .then(() => {
            return {
              sequelize: opts.sequelize,
              models
            }
          });
      }
      return {
        sequelize: opts.sequelize,
        models
      };
    })
};

module.exports = fp(function (fastify, options, next) {
  if (!options) throw new Error('没有设置数据库连接配置文件');
  if(!options.models || options.models.length===0) throw new Error('没有指定数据库模型地址');
  if(!options.db || options.db==={}) throw new Error('没有指定数据库连接信息');
  if(!options.hasOwnProperty('sync')) options.sync = false
  if(!options.hasOwnProperty('forceSync')) options.forceSync = false

  db.configure(options)
    .then((db) => {
      fastify.decorate('db', db)
    })

  next()
})