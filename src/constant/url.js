export const LEGACY_BASE_URL = 'https://darkmap-pi.vercel.app';
export const BASE_URL = 'https://darkmap-front-five.vercel.app/';

export const IS_DEVELOPMENT = process.env.VUE_APP_IS_DEVELOPMENT === 'true';
export const API_BASE_URL = IS_DEVELOPMENT
  ? ''
  : 'https://api.kdark.weareshadowpins.com';
