import { API_BASE_URL } from '@/constant/url';

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  KAKAO: 'kakao',
};

const PROVIDER_ENDPOINTS = {
  [OAUTH_PROVIDERS.GOOGLE]: '/oauth2/authorization/google',
  [OAUTH_PROVIDERS.KAKAO]: '/api/v1/auth/login/kakao',
};

const normalizeBaseUrl = (url) => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const buildQueryString = (redirectPath) => {
  if (!redirectPath) return '';

  const params = new URLSearchParams({
    redirect: redirectPath,
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

export function getOAuthLoginUrl(provider, redirectPath) {
  const endpoint = PROVIDER_ENDPOINTS[provider];

  if (!endpoint) {
    console.error(`Invalid OAuth provider: ${provider}`);
    return null;
  }

  const baseUrl = normalizeBaseUrl(API_BASE_URL);
  const queryString = buildQueryString(redirectPath);

  return `${baseUrl}${endpoint}${queryString}`;
}

export function loginWithOAuth(provider, redirectPath = '/') {
  const url = getOAuthLoginUrl(provider, redirectPath);

  if (!url) {
    throw new Error(`Failed to generate OAuth URL for provider: ${provider}`);
  }

  sessionStorage.setItem('oauth_return_url', window.location.href);
  window.location.href = url;
}
