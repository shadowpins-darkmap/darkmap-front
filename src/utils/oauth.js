import { API_BASE_URL } from '@/constant/url';

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  KAKAO: 'kakao',
};

/**
 * OAuth 로그인 URL 생성
 * @param {string} provider - 'google' | 'kakao'
 * @param {string} redirectPath - 로그인 후 이동할 경로 (선택사항)
 * @returns {string} OAuth 로그인 URL
 */
export function getOAuthLoginUrl(provider, redirectPath = '/social-redirect') {
  const baseUrl = process.env.NODE_ENV === 'development' ? '' : API_BASE_URL;

  const params = new URLSearchParams({
    redirect: redirectPath,
  });

  return `${baseUrl}/api/oauth/${provider}?${params.toString()}`;
}
