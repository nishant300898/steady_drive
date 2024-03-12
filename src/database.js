'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  null,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    pool: config.pool,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('SUCCESSFULLY CONNECTED TO DATABASE');
  })
  .catch((error) => {
    console.log('ERROR IN CONNECTING TO DATABASE', error);
  });

fs.readdirSync(__dirname + '/models')
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, '/models', file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
sequelize.sync();

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;