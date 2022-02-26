const {Sequelize} = require('sequelize')
 
module.exports = new Sequelize(
  {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    dialect : 'postgres',
    host : process.env.DB_HOST,
    port : process.env.DB_PORT
  }
)