# K-Dark Map Frontend 프로젝트 문서

## 📋 프로젝트 개요

K-Dark Map은 길거리 괴롭힘 사건을 제보하고 공유할 수 있는 커뮤니티 플랫폼입니다. 사용자들이 안전한 환경에서 경험을 나누고, 지역별 위험 정보를 시각화하여 제공합니다.

## 🛠 기술 스택

- **Frontend**: Vue.js 3 (Composition API)
- **Build Tool**: Vue CLI
- **HTTP Client**: Axios
- **State Management**: Pinia
- **Styling**: SCSS
- **Deployment**: Vercel

## 📁 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── carousel/        # 캐러셀 컴포넌트
│   ├── commonPanel/     # 공통 패널 컴포넌트
│   ├── commonPopup/     # 공통 팝업 컴포넌트
│   ├── communityPanel/  # 커뮤니티 패널 컴포넌트
│   ├── communityPopup/  # 커뮤니티 팝업 컴포넌트
│   ├── slidePanel/      # 슬라이드 패널 컴포넌트
│   └── ...
├── store/               # Pinia 상태 관리
│   ├── useAuthStore.js  # 인증 상태 관리
│   └── useStatsStore.js # 통계 상태 관리
├── lib/                 # 유틸리티 라이브러리
│   └── api.js          # API 클라이언트 설정
└── assets/             # 정적 자산 (이미지, 아이콘 등)
```

## 🔐 인증 시스템

### 소셜 로그인
- **카카오 로그인**: OAuth 2.0 기반
- **구글 로그인**: OAuth 2.0 기반
- **토큰 관리**: JWT Access Token + Refresh Token
- **자동 갱신**: 토큰 만료 시 자동 갱신 처리

### 인증 플로우
1. 소셜 로그인 팝업 열기
2. 인증 완료 후 토큰 수신
3. 로컬스토리지에 토큰 저장
4. API 요청 시 자동으로 Authorization 헤더 추가

## 🏘 커뮤니티 기능

### 게시글 관리
- **작성**: 제목, 내용, 카테고리, 이미지 첨부
- **조회**: 목록, 상세, 검색, 필터링
- **수정/삭제**: 작성자만 가능
- **좋아요**: 게시글 좋아요/취소
- **신고**: 부적절한 게시글 신고

### 댓글 시스템
- **작성/수정/삭제**: 기본 CRUD 기능
- **신고**: 부적절한 댓글 신고
- **알림**: 내 게시글에 달린 새 댓글 알림

### 카테고리
- 기억, 고민, 질문, 미분류, 제보, 공지

## 📊 통계 및 알림

### 사용자 알림
- **새 댓글**: 내 게시글에 달린 댓글
- **새 좋아요**: 내 게시글에 받은 좋아요
- **다크플레이스 등록**: 제보한 사건 장소 승인
- **활동 요약**: 전체 활동 통계
- **마이페이지**: 내 게시글, 내 댓글 관리

### 전체 통계
- 전체 회원 수
- 전체 게시글 수
- 사건 제보 수

## 🔍 주요 API 엔드포인트

### 인증
- `POST /api/v1/auth/login/kakao` - 카카오 로그인
- `POST /api/v1/auth/refresh` - 토큰 갱신

### 게시글
- `GET /api/v1/boards` - 게시글 목록 조회
- `POST /api/v1/boards` - 게시글 작성
- `GET /api/v1/boards/{id}` - 게시글 상세 조회
- `PUT /api/v1/boards/{id}` - 게시글 수정
- `DELETE /api/v1/boards/{id}` - 게시글 삭제

### 좋아요
- `GET /api/v1/boards/{id}/like/status` - 좋아요 상태 조회
- `GET /api/v1/boards/popular-by-likes` - 인기 게시글 조회
- `GET /api/v1/boards/likes/my` - 내가 좋아요한 게시글

### 사용자 정보
- `GET /api/v1/users/me` - 사용자 정보 조회
- `GET /api/v1/users/profile` - 사용자 프로필 조회
- `GET /api/v1/users/notifications` - 통합 알림 조회
- `GET /api/v1/boards/my` - 내 게시글 조회
- `GET /api/v1/comments/my` - 내 댓글 조회

### 신고
- `POST /api/v1/boards/{id}/reports` - 게시글 신고
- `GET /api/v1/boards/{id}/reports/check` - 신고 여부 확인
- `POST /api/v1/comments/{id}/reports` - 댓글 신고

## 🎨 UI/UX 특징

### 디자인 시스템
- **컬러 팔레트**: 보라색 계열 (#6d54ce, #a190df)
- **포인트 컬러**: 네온 그린 (#00ffc2)
- **다크 테마**: 검은색 배경 기반

### 컴포넌트
- **슬라이드 패널**: 우측에서 슬라이드되는 패널
- **팝업**: 모달 형태의 팝업 (BaseAlertPopup, CommonPopup)
- **캐러셀**: 게시글 미리보기 슬라이더
- **탭 버튼**: 알림/내 게시글/내 댓글 탭
- **페이지네이션**: 목록 페이징 처리
- **아코디언**: 접고 펼치는 UI

## 🚀 배포 및 개발

### 개발 환경
```bash
npm install
npm run serve
```

### 프로덕션 빌드
```bash
npm run build
```

### 배포
- **플랫폼**: Vercel
- **URL**: https://darkmap-front.vercel.app/
- **자동 배포**: GitHub 연동

### 로컬 터널링 (개발용)
```bash
# vue.config.js에서 localtunnel 설정 지원
# WebSocket 비활성화로 HTTPS 환경에서 안정적 동작
```

## 📝 개발 가이드

### 코딩 컨벤션
- **Vue 3 Composition API** 사용
- **SCSS** 스타일링
- **컴포넌트 기반** 개발
- **API 함수 분리**: 각 컴포넌트에서 API 함수 정의

### 상태 관리
- **Pinia** 사용
- **useAuthStore**: 사용자 인증 상태
- **useStatsStore**: 통계 데이터

### API 클라이언트
- **Axios 인터셉터**: 자동 토큰 추가 및 갱신
- **에러 처리**: 401 에러 시 자동 토큰 갱신
- **Base URL**: https://api.kdark.weareshadowpins.com

## 🔧 주요 설정

### Vue Config
```javascript
// vue.config.js
module.exports = {
  devServer: {
    host: '0.0.0.0',
    allowedHosts: 'all',
    webSocketServer: false, // localtunnel HTTPS 호환
  }
}
```

### API 설정
```javascript
// src/lib/api.js
const api = axios.create({
  baseURL: 'https://api.kdark.weareshadowpins.com',
  withCredentials: true
});
```

### 상태 관리 구조
```javascript
// useAuthStore.js
state: {
  accessToken: null,
  nickname: null,
  myBoards: [], // API 응답의 data.data 구조
  myComments: [],
  notifications: []
}
```

## 🐛 알려진 이슈 및 TODO

### 작동되는 것
- [x] 게시글 작성




### 개발 시 주의사항
- localtunnel 사용 시 WebSocket 비활성화 필요
- 302 리다이렉트 에러는 주로 인증 문제
- FormData 사용 시 Content-Type 헤더 자동 설정
- 파일 업로드는 10MB 제한
- computed 값 사용 시 .value 필요 (Vue 3 Composition API)
- API 응답 구조 확인 후 데이터 매핑 (data.data.boards vs data.content)

## 📞 문의 및 지원

프로젝트 관련 문의사항이나 버그 리포트는 GitHub Issues를 통해 제출해 주세요.

---

*이 문서는 프로젝트의 전반적인 구조와 기능을 설명합니다. 상세한 API 명세는 별도의 API 문서를 참조하세요.*