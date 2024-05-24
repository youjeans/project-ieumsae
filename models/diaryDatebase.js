const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const diaryDatebase = sequelize.define('diaryDatebase', {
    diaryNum : { // 일기 번호
        type: DateTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // 기본키
        autoIncrement: true // 추가시 자동으로 1씩 증가하는 옵션
    },
    sendNum : { // 작성자 번호
        type: DateTypes.INTEGER,
        allowNull: false,
    },
    getNum : { // 교환 대상 번호
        type: DateTypes.INTEGER,
        allowNull: false,
    },
    diaryDetail : { // 일기 내용
        type: DateTypes.TEXT,
        allowNull: false,
    },
    writeDate : { // 일기 작성일
        type: DateTypes.DATETIME,
        allowNull: false,
    },
    sendDate : { // 일기 송신일
        type: DateTypes.DATETIME,
        allowNull: false,
    },
    getDate : { // 일기 수신일
        type: DateTypes.DATETIME,
        allowNull: false,
    },
    sendTime : { // 일기 송신 시간 설정
        type: DateTypes.DATETIME,
        allowNull: false,
    },
    sendType : { // 교환 유형
        type: DateTypes.INTEGER,
        allowNull: false,
    },
    getCheck : { // 수신 여부
        type: DateTypes.INTEGER,
        allowNull: false,
    }
});

//외래키 설정 추가적으로 해야 함


module.exports = Draiy;