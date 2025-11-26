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
export function getOAuthLoginUrl(provider, redirectPath = '/') {
  // 백엔드 base URL
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? '' // 로컬: 프록시 사용
      : API_BASE_URL; // 배포: 직접 호출

  // 쿼리 파라미터 구성
  const params = new URLSearchParams({
    redirect: redirectPath,
  });

  // 최종 URL 반환
  return `${baseUrl}/api/oauth/${provider}?${params.toString()}`;
}
