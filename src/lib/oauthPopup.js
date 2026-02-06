const DEFAULT_POPUP_FEATURES = 'width=480,height=720,menubar=no,toolbar=no,location=no,status=no';
const DEFAULT_TIMEOUT = 2 * 60 * 1000; // 2 minutes

const isOriginAllowed = (origin, allowedOrigins) => {
  if (!Array.isArray(allowedOrigins) || allowedOrigins.length === 0) {
    return true;
  }

  return allowedOrigins.includes('*') || allowedOrigins.includes(origin);
};

/**
 * Opens an OAuth popup and waits for a postMessage with tokens.
 * @param {string} url popup url
 * @param {object} options popup options
 * @param {string[]} [options.targetOrigins=[window.location.origin]] allowed postMessage origins
 * @param {string} [options.name='oauth-login'] popup window name
 * @param {string} [options.features] popup window features string
 * @param {number} [options.timeout] timeout in ms
 * @returns {Promise<object>} resolves with the payload from the OAUTH_SUCCESS event
 */
export function openOAuthPopup(url, options = {}) {
  const {
    targetOrigins = [window.location.origin],
    name = 'oauth-login',
    features = DEFAULT_POPUP_FEATURES,
    timeout = DEFAULT_TIMEOUT,
  } = options;

  return new Promise((resolve, reject) => {
    const popup = window.open(url, name, features);

    if (!popup) {
      reject(new Error('로그인 팝업을 열 수 없습니다. 브라우저 팝업 차단을 확인해 주세요.'));
      return;
    }

    const cleanup = () => {
      window.removeEventListener('message', handleMessage);
      if (closeTimer) {
        clearInterval(closeTimer);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    const finalize = (callback) => {
      cleanup();
      try {
        if (!popup.closed) {
          popup.close();
        }
      } catch (error) {
        console.warn('OAuth 팝업 종료 중 오류가 발생했습니다:', error);
      }
      callback();
    };

    const handleMessage = (event) => {
      if (!event?.data?.type || !isOriginAllowed(event.origin, targetOrigins)) {
        return;
      }

      if (event.data.type === 'OAUTH_SUCCESS') {
        finalize(() => resolve(event.data.payload));
      } else if (
        event.data.type === 'OAUTH_FAILURE' ||
        event.data.type === 'OAUTH_ERROR'
      ) {
        finalize(() =>
          reject(
            new Error(
              event.data.payload?.message ||
                '소셜 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.',
            ),
          ),
        );
      }
    };

    window.addEventListener('message', handleMessage);

    const closeTimer = setInterval(() => {
      if (popup.closed) {
        finalize(() =>
          reject(new Error('로그인 창이 닫혀 인증이 완료되지 않았습니다.')),
        );
      }
    }, 500);

    const timeoutId = setTimeout(() => {
      finalize(() =>
        reject(new Error('로그인 제한 시간이 초과되었습니다. 다시 시도해 주세요.')),
      );
    }, timeout);
  });
}
