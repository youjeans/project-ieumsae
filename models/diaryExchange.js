const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const diaryDatabase = require('./diaryDatabase'); // 동기화 설정 위함

const diaryExchange = sequelize.define('diaryExchange',{
    exchangeNum: { // 교환 기록 번호
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true
        // 외래키 설정
    },
    diaryNum: { // 일기 번호
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    sendNum: { // 송산자 번호
        type: DataTypes.INTEGER,
        allowNull: false,
        // 외래키 설정
    },
    getNum: { // 수신자 번호
        type: DataTypes.INTEGER,
        allowNull: false,
        // 외래키 설정
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

// diaryDatebase와 diartExchange 일대일 관계 설정
diaryDatabase.hasOne(diaryExchange);
diaryExchange.belongsTo(diaryDatabase);

module.exports = diaryExchange;