const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '..', '..', 'config/mongoConfig.json');
const config = require(configPath)[env];

const basename = path.basename(__filename);

mongoose.connect(
  `mongodb://${config.host}:${config.port}/${config.database}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  }
);

const db = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    db[model.modelName] = model;
  });

mongoose.set('debug', env === 'development');

db.mongoose = mongoose;

module.exports = db;
