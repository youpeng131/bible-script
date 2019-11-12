'use strict';

import config from 'environment';
import Sequelize from 'sequelize';
// console.log(config.sequelize.uri);
// console.log(config.sequelize.options);
var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

module.exports = db;


