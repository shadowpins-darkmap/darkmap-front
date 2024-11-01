import { ref } from "vue"

const gu = [
    "강남구", "강동구", "강서구", 
    "강북구", "광진구", "구로구", "금천구", "노원구",
    // "동대문구", "도봉구", "동작구", "마포구", "서대문구", "성동구", "성북구", "서초구",
    // "송파구", "영등포구", "용산구", "양천구", "은평구", "종로구", "중구", "중랑구"
]

const dong = ref({
    "강남구": [
        { name: "개포동", checked: true }, 
        { name: "논현동", checked: true },
        { name: "대치동", checked: true },
        { name: "도곡동", checked: true },
        { name: "삼성동", checked: true },
        { name: "세곡동", checked: true },
        { name: "수서동", checked: true },
        { name: "신사동", checked: true },
        { name: "압구정동", checked: true },
        { name: "역삼동", checked: true },
        { name: "일원동", checked: true },
        { name: "청담동", checked: true },
    ],
    "강동구": [
        { name: "강일동", checked: true }, 
        { name: "고덕동", checked: true }, 
        { name: "길동", checked: true }, 
        { name: "둔촌동", checked: true }, 
        { name: "명일동", checked: true }, 
        { name: "상일동", checked: true }, 
        { name: "성내동", checked: true }, 
        { name: "암사동", checked: true }, 
        { name: "천호동", checked: true }, 
    ],
    "강서구": [
        { name: "가양동", checked: true }, 
        { name: "공항동", checked: true }, 
        { name: "등촌동", checked: true }, 
        { name: "발산동", checked: true }, 
        { name: "방화동", checked: true }, 
        { name: "염창동", checked: true }, 
        { name: "우잔산동", checked: true }, 
        { name: "화곡동", checked: true }, 
    ],
    // "강북구": [

    // ],
    // "광진구": [

    // ],
    // "구로구": [

    // ],
    // "금천구": [

    // ],
    // "노원구": [

    // ],
    // "동대문구": [

    // ],
    // "도봉구": [

    // ],
    // "동작구": [

    // ],
    // "마포구": [

    // ],
    // "서대문구": [

    // ],
    // "성동구": [

    // ],
    // "성북구": [

    // ],
    // "서초구": [

    // ],
    // "송파구": [

    // ],
    // "영등포구": [

    // ],
    // "용산구": [

    // ],
    // "양천구": [

    // ],
    // "은평구": [

    // ],
    // "종로구": [

    // ],
    // "중구": [

    // ],
    // "중랑구": [

    // ]
})

export { gu, dong }
