const Pack = require('./package')

module.exports = {
  port: 8000,
  sequelize: {
    models: ['./src/models/**/*.js'],
    db: {
      dialect: 'mysql',
      host: 'localhost',
      database: 'lygtq-eros-publish',
      user: 'root',
      password: 'root',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    },
    sync: true,
    forceSync: false
  }
}