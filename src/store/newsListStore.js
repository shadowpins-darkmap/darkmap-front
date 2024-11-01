import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNewsListStore = defineStore('counter', () => {
    // TODO 임시
    const articles = ref([
        {
            title: "공원서 초등생에 다가가 음란행위 한 남성, 4차례 동종 전과에도 ‘집유’",
            position: { lat: 37.66727, lng: 127.07242 },
            category: "",
            sido: "서울",
            sigungu: "노원구",
            dong: "상계동",
            url: "http://www.segye.com/content/html/2022/01/18/20220118514129.html"
        },
        {
            title: "체액 테러 바바리맨 '그놈' 걸려도 또 나타나는 이유 있었네",
            position: { lat: 37.6643214, lng: 127.033378037964 },
            sido: "서울",
            sigungu: "도봉구",
            dong: "방학동",
            url: "http://news.moneytoday.co.kr/view/mtview.php?no=2022020813285888382&type=2"
        },
        {
            title: "여고생 성폭행 혐의 20대男, 실형에 항소 \"합의하에 했다\"",
            position: { lat: 37.54992705, lng: 126.959289719949 },
            sido: "서울",
            sigungu: "마포구",
            dong: "공덕동",
            url: "http://news.moneytoday.co.kr/view/mtview.php?no=2021112709203561316&type=2"
        },
        {
            title: "여고생 성폭행 혐의 20대男, 실형에 항소 \"합의하에 했다\"",
            position: { lat: 37.54992705, lng: 126.959289719949 },
            sido: "서울",
            sigungu: "마포구",
            dong: "공덕동",
            url: "http://news.moneytoday.co.kr/view/mtview.php?no=2021112709203561316&type=2"
        }
    ])
    
  return {
    articles,
  }
})
