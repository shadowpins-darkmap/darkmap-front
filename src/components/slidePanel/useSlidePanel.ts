import { ref } from 'vue';

const isSlideOpen = ref(false);

export const useSlidePanel = () => {
  const open = () => (isSlideOpen.value = true);
  const close = () => (isSlideOpen.value = false);

  return {
    isSlideOpen,
    open,
    close,
  };
};
