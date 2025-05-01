import { ref, onMounted, onUnmounted } from 'vue'

export function useDevice() {
  const isMobile = ref(window.innerWidth <= 767)

  const update = () => {
    isMobile.value = window.innerWidth <= 767
  }

  onMounted(() => {
    window.addEventListener('resize', update)
    update()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { isMobile }
}
