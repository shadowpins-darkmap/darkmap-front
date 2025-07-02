<template>
  <div class="BaseLoader"></div>
</template>

<style scoped>
.BaseLoader {
  width: 100px;
  padding: 16px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #6d54ce;
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
  to {
    transform: rotate(1turn);
  }
}
</style>
