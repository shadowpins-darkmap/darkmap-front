<template>
  <div class="redirect">
    <p>로그인 정보를 확인 중입니다...</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute();

onMounted(() => {
  const accessToken = route.query.accessToken;
  const refreshToken = route.query.refreshToken;

  console.log('✅ accessToken:', accessToken);
  console.log('✅ refreshToken:', refreshToken);

  if (window.opener && accessToken) {
    window.opener.postMessage({ accessToken, refreshToken }, '*');
    window.close();
  }
});
</script>
