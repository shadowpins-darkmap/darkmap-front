export const BASE_URL = 'https://darkmap-front-five.vercel.app';

export const IS_DEVELOPMENT = process.env.VUE_APP_IS_DEVELOPMENT === 'true';
export const DEFAULT_API_URL = 'https://api.kdark.weareshadowpins.com';
export const LOCAL_API_URL = 'http://localhost:8080';

const isBrowser = typeof window !== 'undefined';
const hostname = isBrowser ? window.location.hostname : '';
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
const shouldUseLocalApi =
  (IS_DEVELOPMENT || process.env.NODE_ENV !== 'production') && isLocalhost;

export const API_BASE_URL =
  process.env.VUE_APP_API_BASE_URL ??
  (shouldUseLocalApi ? LOCAL_API_URL : DEFAULT_API_URL);
