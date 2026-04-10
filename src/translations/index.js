import en from './en';
import ko from './ko';

const dictionaries = {
  en,
  ko,
};

export const getLocale = (isWorldTour) => (isWorldTour ? 'en' : 'ko');

export const t = (locale, key, params = {}) => {
  const dict = dictionaries[locale] || dictionaries.ko;
  const value = key
    .split('.')
    .reduce((acc, current) => (acc ? acc[current] : undefined), dict);

  if (typeof value !== 'string') {
    return key;
  }

  return Object.keys(params).reduce((result, paramKey) => {
    return result.replaceAll(`{${paramKey}}`, String(params[paramKey]));
  }, value);
};
