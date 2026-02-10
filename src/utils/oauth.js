import { API_BASE_URL, BASE_URL, DEFAULT_API_URL } from '@/constant/url';

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  KAKAO: 'kakao',
};

const OAUTH_ENDPOINT_PATHS = {
  [OAUTH_PROVIDERS.GOOGLE]: '/oauth2/authorization/google',
  [OAUTH_PROVIDERS.KAKAO]: '/api/v1/auth/login/kakao',
};

const FALLBACK_API_BASE_URL = DEFAULT_API_URL;
const PROVIDERS_SUPPORTING_REDIRECT = new Set([OAUTH_PROVIDERS.KAKAO]);

const getDefaultFrontendOrigin = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return BASE_URL;
};

export function getOAuthLoginUrl(provider, options = {}) {
  const endpointPath = OAUTH_ENDPOINT_PATHS[provider];
  if (!endpointPath) {
    throw new Error(`[getOAuthLoginUrl] Unsupported provider: ${provider}`);
  }

  const baseUrl = API_BASE_URL || FALLBACK_API_BASE_URL;
  const resolvedUrl = new URL(endpointPath, baseUrl);
  const redirectUri = options.redirectUri ?? getDefaultFrontendOrigin();

  if (redirectUri && PROVIDERS_SUPPORTING_REDIRECT.has(provider)) {
    resolvedUrl.searchParams.set('redirectUri', redirectUri);
  }

  if (options.params && typeof options.params === 'object') {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        resolvedUrl.searchParams.set(key, String(value));
      }
    });
  }

  return resolvedUrl.toString();
}
