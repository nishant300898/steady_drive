module.exports = {
    development: {
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.HOST,
      port: process.env.DB_PORT,
      pool: {
        max: 101,
        min: 0,
        idle: 10000,
        acquire: 60000
      },
      dialect: "mysql"
    },
    production: {
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.HOST,
      port: process.env.DB_PORT
    }
  }