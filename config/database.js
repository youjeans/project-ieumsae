const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ieumsae','root','4151561',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;