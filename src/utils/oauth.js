import { API_BASE_URL } from '@/constant/url';

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  KAKAO: 'kakao',
};

const OAUTH_ENDPOINT_PATHS = {
  [OAUTH_PROVIDERS.GOOGLE]: '/oauth2/authorization/google',
  [OAUTH_PROVIDERS.KAKAO]: '/api/v1/auth/login/kakao',
};

/**
 * OAuth 로그인 URL 생성
 * @param {string} provider - 'google' | 'kakao'
 * @param {string} redirectPath - 로그인 후 이동할 경로 (선택사항)
 * @returns {string} OAuth 로그인 URL
 */
export function getOAuthLoginUrl(provider, redirectPath = '/social-redirect') {
  const redirectUrl = redirectPath.startsWith('http')
    ? redirectPath
    : `${window.location.origin}${redirectPath}`;

  const endpointPath = OAUTH_ENDPOINT_PATHS[provider];
  if (!endpointPath) {
    throw new Error(`[getOAuthLoginUrl] Unsupported provider: ${provider}`);
  }

  const baseUrl = API_BASE_URL || 'https://api.kdark.weareshadowpins.com';
  const params = new URLSearchParams({
    redirect: redirectUrl,
  });

  const loginUrl = `${baseUrl}${endpointPath}?${params.toString()}`;
  return loginUrl;
}
