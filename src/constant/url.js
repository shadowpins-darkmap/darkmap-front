export const LEGACY_BASE_URL = 'https://darkmap-pi.vercel.app';
export const BASE_URL = 'https://darkmap-front-five.vercel.app';

export const IS_DEVELOPMENT = process.env.VUE_APP_IS_DEVELOPMENT === 'true';
export const DEFAULT_API_URL = 'https://api.kdark.weareshadowpins.com';
export const API_BASE_URL = process.env.VUE_APP_API_BASE_URL ?? DEFAULT_API_URL;
