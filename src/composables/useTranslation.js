import { computed } from 'vue';
import { useTourModeStore } from '@/store/useTourModeStore';
import { getLocale, t as translate } from '@/translations';

export const useTranslation = () => {
  const tourModeStore = useTourModeStore();

  const locale = computed(() => getLocale(tourModeStore.isWorldTour));

  const t = (key, params = {}) => {
    return translate(locale.value, key, params);
  };

  return {
    locale,
    t,
  };
};
