<script setup>
import 'vue3-carousel/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';

// 이미지 데이터
const images = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  url: `https://picsum.photos/seed/${Math.random()}/500/500`,
}));

const carouselConfig = {
  height: 200,
  itemsToShow: 1.2,
  gap: 20,
  autoplay: 2000,
  wrapAround: true,
  pauseAutoplayOnHover: true,
};
</script>

<template>
  <Carousel v-bind="carouselConfig">
    <Slide v-for="image in images" :key="image.id">
      <div class="slide_wrap">
        <div class="slide_card">
          <!-- <img :src="image.url" alt="image" /> -->
        </div>
      </div>
    </Slide>
  </Carousel>
</template>
<style scoped lang="scss">
/* .carousel {} */
.carousel__slide {
  transform: translateX(-20px);
}

.slide_wrap {
  width: 328px;
  height: 169px;
  border: 1px solid #f1cfc8;
  overflow: hidden;
  border-radius: 8px;
  background-color: #ffffff52;
}
.slide_card {
}
</style>
