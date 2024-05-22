const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const diaryDatebase = sequelize.define('diaryDatebase', {
    /*
    일기 번호, 작성자 번호, 수신자 번호, 일기 내용
    일기 작성일, 일기 송신일, 일기 수신일, 일기 송신 시간 설정
    교환 대상, 일기 교환 여부
    모델 정의
    */
    diaryNum : {
        type: DateTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    senderNum : {
        type: DateTypes.INTEGER,
        allowNull: false,
    },
    receiverNum : {
        type: DateTypes.INTEGER,
        allowNull: false,
    },
    diaryDetail : {
        type: DateTypes.TEXT,
        allowNull: false,
    },
    writeDate : {
        type: DateTypes.DATETIME,
        allowNull: false,
    },
    sendDate : {
        type: DateTypes.DATETIME,
        allowNull: false,
    },
    getDate : {
        type: DateTypes.DATETIME,
        allowNull: false,
    },
    sendTime : {
        type: DateTypes.DATETIME,
        allowNull: false,
    },
    sendType : {
        type: DateTypes.INTEGER,
        allowNull: false,
    },
    receiveCheck : {
        type: DateTypes.INTEGER,
        allowNull: false,
    }
});

//외래키 설정 추가적으로 해야 함


module.exports = Draiy;