<template>
  <div class="main_view">
    <RenderMap />
    <LoginView v-if="showLoginModal" @close="handleCloseLogin" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RenderMap from '@/components/RenderMap.vue';
import LoginView from '@/views/auth/LoginView.vue';

const route = useRoute();
const router = useRouter();

const showLoginModal = computed(() => route.path === '/login');

const handleCloseLogin = () => {
  if (route.query?.redirect) {
    router.replace(String(route.query.redirect));
    return;
  }
  router.replace('/');
};
</script>

<style scoped>
.main_view {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
