import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useTourModeStore = defineStore(
  'tourMode',
  () => {
    const mode = ref('korea');

    const isWorldTour = computed(() => mode.value === 'world');
    const isKoreaTour = computed(() => mode.value === 'korea');

    const setTourMode = (nextMode) => {
      if (nextMode !== 'korea' && nextMode !== 'world') {
        return;
      }
      mode.value = nextMode;
    };

    const toggleTourMode = () => {
      mode.value = mode.value === 'korea' ? 'world' : 'korea';
    };

    return {
      mode,
      isWorldTour,
      isKoreaTour,
      setTourMode,
      toggleTourMode,
    };
  },
  {
    persist: true,
  },
);
