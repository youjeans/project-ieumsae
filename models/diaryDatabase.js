const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const diaryDatabase = sequelize.define('diaryDatabase', {
    diaryNum : { // 일기 번호
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // 기본키
        autoIncrement: true // 추가시 자동으로 1씩 증가하는 옵션
    },
    sendNum : { // 작성자 번호
        type: DataTypes.INTEGER,
        allowNull: false,
        // 외래키 설정 필요
    },
    getNum : { // 수신자 번호 (교환 대상 번호)
        type: DataTypes.INTEGER,
        allowNull: false,
        // 외래키 설정 필요
    },
    diaryDetail : { // 일기 내용
        type: DataTypes.TEXT,
        allowNull: false,
    },
    writeDate : { // 일기 작성일
        type: DataTypes.DATE,
        allowNull: false,
    },
    sendDate : { // 일기 송신일
        type: DataTypes.DATE,
        allowNull: false,
    },
    getDate : { // 일기 수신일
        type: DataTypes.DATE,
        allowNull: false,
    },
    sendTime : { // 일기 송신 시간 설정
        type: DataTypes.DATE,
        allowNull: false,
    },
    sendType : { // 교환 유형
        type: DataTypes.ENUM(0, 1, 2, 3),
        allowNull: false,
    },
    getCheck : { // 일기 수신 여부
        type: DataTypes.ENUM(0,1),
        allowNull: false,
    }
});

//외래키 설정 - 모델 간 관계 정리 필요 (파일 합칠 때 설정)


module.exports = diaryDatabase;