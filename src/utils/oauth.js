import { API_BASE_URL, DEFAULT_API_URL } from '@/constant/url';

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  KAKAO: 'kakao',
};

const OAUTH_ENDPOINT_PATHS = {
  [OAUTH_PROVIDERS.GOOGLE]: '/oauth2/authorization/google',
  [OAUTH_PROVIDERS.KAKAO]: '/api/v1/auth/login/kakao',
};

const FALLBACK_API_BASE_URL = API_BASE_URL || DEFAULT_API_URL;

export function getOAuthLoginUrl(provider) {
  const endpointPath = OAUTH_ENDPOINT_PATHS[provider];
  if (!endpointPath) {
    throw new Error(`[getOAuthLoginUrl] Unsupported provider: ${provider}`);
  }

  const baseUrl = API_BASE_URL || FALLBACK_API_BASE_URL;
  return `${baseUrl}${endpointPath}`;
}
