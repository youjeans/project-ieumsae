const sequelize = require("./database");

const Dariy = sequelize.define('Dairy', {
    /*
    일기 번호, 작성자 번호, 수신자 번호, 일기 내용, 일기 작성일, 일기 송신일, 일기 수신일, 일기 송신 시간 설정, 교환 대상, 일기 교환 여부
    모델 정의
    */
    dairyNum : {
        type: DateType.INTEGER,
        allowNull: false,
        primarykey: true,
    },
    senderNum : {
        type: DateType.INTEGER,
        allowNull: false,
    },
    receiverNum : {
        type: DateType.INTEGER,
        allowNull: false,
    },
    diaryDetail : {
        type: DateType.TEXT,
        allowNull: false,
    },
    writeDate : {
        type: DateType.DATETIME,
        allowNull: false,
    },
    sendDate : {
        type: DateType.DATETIME,
        allowNull: false,
    },
    getDate : {
        type: DateType.DATETIME,
        allowNull: false,
    },
    sendTime : {
        type: DateType.DATETIME,
        allowNull: false,
    },
    sendType : {
        type: DateType.INTEGER,
        allowNull: false,
    },
    receiveCheck : {
        type: DateType.INTEGER,
        allowNull: false,
    }
});

//외래키 설정 추가적으로 해야 함


module.exports = Dariy;