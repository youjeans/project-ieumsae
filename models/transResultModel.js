// 일기_송신일 변환 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const week = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][date.getDay()];

    return `${year}년 ${month}월 ${day}일 ${week}`;
};

// 일기 교환유형 대입 및 랜덤의 경우 익명으로 변경
const transResult = (result) => {
    return result.map((diary) => {
        if (diary.교환유형) {
            switch (diary.교환유형) {
                case 0:
                    diary.교환유형 = "나";
                    break;
                case 1:
                    diary.교환유형 = "친구";
                    break;
                case 2:
                    diary.교환유형 = "랜덤";
                    if (diary.송신자_이름) diary.송신자_이름 = "익명";
                    if (diary.작성자_이름) diary.작성자_이름 = "익명";
                    break;
                case 3:
                    diary.교환유형 = "그룹";
                    break;
                default:
                    diary.교환유형 = "알 수 없음";
            }
        }
        if (diary.일기_송신일) diary.일기_송신일 = formatDate(diary.일기_송신일);
        if (diary.수신일시) diary.수신일시 = formatDate(diary.수신일시);
        return diary;
    })
};

module.exports = transResult;