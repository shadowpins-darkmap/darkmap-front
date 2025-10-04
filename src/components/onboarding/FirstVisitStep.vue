<template>
  <div v-if="showAlert" class="modal-overlay">
    <div class="welcome-modal">
      <p class="welcome-text">{{ nickname }}님의</p>
      <p class="welcome-text">첫 방문을 환영합니다!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';

defineProps({
  nickname: String
});

const emit = defineEmits(['confirm']);

const showAlert = ref(true);

onMounted(() => {
  setTimeout(() => {
    showAlert.value = false;
    emit('confirm');
  }, 2000);
});
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.welcome-modal {
  width: 300px;
  height: 378px;
  background: #6d54ce;
  border: 2px solid #f1cfc8;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.welcome-text {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin: 0;
  line-height: 1.4;
  color: white;
}
</style>