const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const diaryExchange = sequelize.define('diaryExchange',{
    exchangeNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    diaryNum: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    sendNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    getNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sendDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    getDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    viewYN: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
    }
});

module.exports = diaryExchange;