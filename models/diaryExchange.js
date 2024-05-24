const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const diaryExchange = sequelize.define('diaryExchange',{
    exchangeNum: { // 교환 기록 번호
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    diaryNum: { // 일기 번호
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    sendNum: { // 송산자 번호
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    getNum: { // 수신자 번호
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sendDate: { // 송신 일시
        type: DataTypes.DATE,
        allowNull: false,
    },
    getDate: { // 수신 일시
        type: DataTypes.DATE,
        allowNull: false,
    },
    viewYN: { // 조회 여부
        type: DataTypes.INTEGER,
        allowNull: false,
        
    }
});

module.exports = diaryExchange;