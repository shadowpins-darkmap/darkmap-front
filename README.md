# 다크맵투어 프론트엔드 (darkmap-front)

> 🇺🇸 [English README](./README.en.md)

**다크맵투어(DarkMap Tour)** 는 길거리 괴롭힘·성범죄 사건을 지도 위에 시각화하고,  
시민 제보와 커뮤니티를 통해 안전한 거리를 만들어가는 **시빅 해킹 프로젝트**입니다.  
이 레포지토리는 [ShadowPins](https://weareshadowpins.com)가 운영합니다.

- 서비스 URL: [https://kdark.weareshadowpins.com](https://kdark.weareshadowpins.com)
- 배포 환경: [Vercel](https://vercel.com) (PR → 레포 오너 머지 → 자동 배포)

---

## 목차

1. [프로젝트 소개](#1-프로젝트-소개)
2. [기술 스택](#2-기술-스택)
3. [주요 기능](#3-주요-기능)
4. [시작하기](#4-시작하기)
5. [프로젝트 구조](#5-프로젝트-구조)
6. [환경 변수](#6-환경-변수)
7. [개발 참여 방법](#7-개발-참여-방법)
8. [보안 제보](#8-보안-제보)
9. [라이선스](#9-라이선스)

---

## 1. 프로젝트 소개

다크맵은 **시빅 해킹** 방식으로 운영되는 비영리 공익 프로젝트입니다.  
범죄 뉴스 기사 데이터를 지도 위에 시각화하고, 시민이 직접 사건을 제보하거나  
커뮤니티에서 경험을 나눌 수 있는 플랫폼을 제공합니다.

| 항목 | 내용 |
|---|---|
| 운영 단체 | [ShadowPins](https://weareshadowpins.com) |
| 프로젝트 성격 | 비영리 시빅 해킹 |
| 대상 | 길거리 괴롭힘·성범죄 피해 경험자, 관심 시민 |
| 주요 언어 | 한국어, 영어 |

---

## 2. 기술 스택

| 분류 | 기술 |
|---|---|
| UI 프레임워크 | [Vue 3](https://vuejs.org/) (Composition API) |
| 상태 관리 | [Pinia](https://pinia.vuejs.org/) + pinia-plugin-persistedstate |
| 라우팅 | [Vue Router 4](https://router.vuejs.org/) |
| 지도 | [Google Maps JS API](https://developers.google.com/maps) + MarkerClusterer |
| HTTP 클라이언트 | [Axios](https://axios-http.com/) |
| 빌드 도구 | Vue CLI 5 (Webpack 기반) |
| 스타일 | SCSS (Sass) |
| 배포 | [Vercel](https://vercel.com) |
| Node.js | v20 (`.nvmrc` 관리) |

---


## 3. 주요 기능

### 지도 시각화

- 범죄 뉴스 기사를 Google Maps 마커로 표시
- 범죄 유형별 색상 구분 (폭행 · 미행 · 바바리맨 · 헌팅 등)
- MarkerClusterer를 통한 클러스터링
- 자치구(구) 단위 필터링 및 검색

### 커뮤니티

- 로그인: Kakao / Google OAuth2
- 신규 가입 시 온보딩 플로우 (닉네임 설정 · 마케팅 동의)
- 게시판 카테고리: 경험 공유 · 고민 · 질문 · 제보 · 공지 등
- 댓글 · 좋아요 · 신고 기능
- 사건 직접 제보 양식

### 월드 투어 모드

- 해외(영국 · 미국 · 오스트리아 등) 사이버플래싱 처벌 사례 지도
- 국가별 탭, 사례 카드, FAQ, 뉴스레터 신청 기능

---

## 4. 시작하기

### 사전 요구사항

- Node.js v20 (권장)
- npm

```bash
# Node.js 버전 맞추기 (nvm 사용 시)
nvm use
```

### 설치

```bash
npm install
```

### 로컬 개발 서버 실행

```bash
npm run serve
```

브라우저에서 `http://localhost:3000` 접속

> 로컬에서 백엔드 API를 함께 실행하는 경우, `vue.config.js`의 프록시 설정에서  
> `/api` 대상을 `http://localhost:8080`(Spring Boot 기본 포트)으로 지정합니다.

### 프로덕션 빌드

```bash
npm run build
```

### 린트 및 코드 포맷 검사

```bash
npm run lint
```

---

## 5. 프로젝트 구조

```
src/
├── api/            # Axios API 모듈
│   ├── articles.js
│   ├── boards.js
│   ├── comments.js
│   ├── crimeCases.js
│   ├── cyberFlashing.js
│   └── user.js
├── assets/         # 이미지, 아이콘 등 정적 자원
├── components/     # 재사용 UI 컴포넌트
├── composables/    # Vue Composition 훅 (useDevice, useTranslation)
├── constant/       # 상수 및 코드 정의 (URL, 지역 데이터 등)
├── lib/            # 서드파티 래퍼 및 유틸리티
├── routers/        # Vue Router 설정
├── store/          # Pinia 스토어
│   ├── useAuthStore.js
│   ├── useStatsStore.js
│   ├── newsListStore.js
│   ├── useTourModeStore.js
│   ├── useCaseTourStore.js
│   └── useCyberFlashingStore.js
├── styles/         # 전역 SCSS 스타일
├── translations/   # i18n 번역 파일 (ko.js / en.js)
├── utils/          # 공용 유틸 함수
└── views/          # 페이지 뷰 컴포넌트
    └── MainView.vue
```

---

## 6. 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 값을 설정하세요.  
(실제 키 값은 팀 내부 채널을 통해 공유됩니다.)

```env
VUE_APP_GOOGLE_MAP_API_KEY=    # Google Cloud Console에서 Maps JS API 키 발급
VUE_APP_API_BASE_URL=          # 로컬 개발 시 http://localhost:3000 등으로 대체 가능
```

| 변수명 | 설명 |
|---|---|
| `VUE_APP_GOOGLE_MAP_API_KEY` | Google Maps JavaScript API 키 |
| `VUE_APP_API_BASE_URL` | 백엔드 API 베이스 URL |


> ⚠️ `.env.local`은 절대 Git에 커밋하지 마세요. `.gitignore`에 이미 포함되어 있습니다.

---

## 7. 개발 참여 방법

다크맵은 기여를 환영합니다!

### 기여 흐름

1. 이 레포지토리를 Fork합니다.
2. 기능 브랜치를 생성합니다: `git checkout -b feature/my-feature`
3. 변경 사항을 커밋합니다: `git commit -m "feat: 기능 설명"`
4. 브랜치에 Push합니다: `git push origin feature/my-feature`
5. Pull Request를 생성합니다.
6. 레포 오너가 PR을 검토 후 머지하면 Vercel을 통해 자동 배포됩니다.

### 커밋 메시지 컨벤션

| 타입 | 설명 |
|---|---|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `style` | 코드 포맷, 스타일 수정 |
| `docs` | 문서 수정 |
| `chore` | 빌드·설정 변경 |

---

## 8. 보안 제보

서비스 이용 중 보안 취약점을 발견하셨다면, 공개 이슈 대신 아래 이메일로 제보해 주세요.  
내용을 검토 후 빠르게 대응하겠습니다.

**📧 [weareshadowpins@gmail.com](mailto:weareshadowpins@gmail.com)**

제보 시 다음 정보를 포함해 주시면 도움이 됩니다:

- 취약점 유형 및 발생 경로
- 재현 방법 (스크린샷 또는 단계별 설명)
- 예상되는 영향 범위

---

## 9. 라이선스

이 프로젝트는 공익 목적의 시빅 해킹 활동으로 운영됩니다.  
라이선스 정책은 내부 협의 후 확정 예정입니다.
