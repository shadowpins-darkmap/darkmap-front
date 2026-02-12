export const BASE_URL = 'https://darkmap-front-five.vercel.app';

export const IS_DEVELOPMENT = process.env.VUE_APP_IS_DEVELOPMENT === 'true';
export const DEFAULT_API_URL = 'https://api.kdark.weareshadowpins.com';
export const LOCAL_API_URL = 'http://localhost:8080';

export const API_BASE_URL =
  // 환경 변수로 지정되면 항상 우선 사용
  process.env.VUE_APP_API_BASE_URL ?? DEFAULT_API_URL;
