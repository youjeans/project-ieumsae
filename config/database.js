const {sequelize} = require('sequelize');

const sequelize = new sequelize('ieumsae','root','root',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;