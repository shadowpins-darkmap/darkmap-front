const AUTH_PAYLOAD_KEY = 'auth_payload';
const AUTH_ERROR_KEY = 'auth_error';

const tryParseJson = (value) => {
  if (!value) {
    return null;
  }

  const candidates = [value];

  try {
    const decoded = decodeURIComponent(value);
    if (decoded !== value) {
      candidates.push(decoded);
    }
  } catch (error) {
    // ignore decoding errors
  }

  const maybeDecodeBase64 = (input) => {
    if (typeof window === 'undefined' || typeof window.atob !== 'function') {
      return null;
    }
    try {
      return window.atob(input);
    } catch (error) {
      return null;
    }
  };

  candidates.forEach((candidate) => {
    const decoded = maybeDecodeBase64(candidate);
    if (decoded) {
      candidates.push(decoded);
    }
  });

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch (error) {
      continue;
    }
  }

  return null;
};

const cleanHashFromUrl = () => {
  if (typeof window === 'undefined' || typeof window.history === 'undefined') {
    return;
  }
  const cleanUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;
  window.history.replaceState({}, document.title, cleanUrl);
};

export const consumeAuthPayloadFromHash = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const { hash } = window.location;
  if (!hash || hash.length < 2) {
    return null;
  }

  const params = new URLSearchParams(hash.slice(1));
  const payload = params.get(AUTH_PAYLOAD_KEY);
  const errorPayload = params.get(AUTH_ERROR_KEY);

  if (!payload && !errorPayload) {
    return null;
  }

  cleanHashFromUrl();

  if (payload) {
    return {
      type: 'success',
      data: tryParseJson(payload) ?? {},
    };
  }

  return {
    type: 'error',
    data: tryParseJson(errorPayload) ?? {},
  };
};
