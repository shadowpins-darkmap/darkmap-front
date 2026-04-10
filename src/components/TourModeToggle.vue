<template>
  <div class="TourModeToggle">
    <span
      class="TourModeToggle__label TourModeToggle__label--korea"
      :class="{ active: tourModeStore.isKoreaTour }"
      >Korea Tour</span
    >
    <button
      class="TourModeToggle__switch"
      type="button"
      :class="{ world: tourModeStore.isWorldTour }"
      @click="tourModeStore.toggleTourMode"
      :aria-pressed="tourModeStore.isWorldTour"
    >
      <span class="TourModeToggle__thumb" />
    </button>
    <span
      class="TourModeToggle__label TourModeToggle__label--world"
      :class="{ active: tourModeStore.isWorldTour }"
      >World Tour</span
    >
  </div>
</template>

<script setup>
import { useTourModeStore } from '@/store/useTourModeStore';

const tourModeStore = useTourModeStore();
</script>

<style scoped lang="scss">
.TourModeToggle {
  position: absolute;
  left: 140px;
  top: 53px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 0px;
  height: 24px;
  z-index: 3;
}

.TourModeToggle__label {
  font-family: 'Noto Sans KR', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
  flex: none;
  flex-grow: 0;
  width: 70px;
  height: 24px;
  color: #d9d9d9a4;
  transition: color 0.2s ease;
}

.TourModeToggle__label.active {
  color: #f1cfc8;
  // -webkit-text-stroke: 0.1px #f1cfc8;
}

.TourModeToggle__label--korea {
  order: 0;
}

.TourModeToggle__label--world {
  order: 2;
  justify-content: flex-end;
  text-align: right;
}

.TourModeToggle__switch {
  width: 40px;
  height: 18px;
  position: relative;
  border: none;
  padding: 0;
  background: transparent;
  flex: none;
  order: 1;
  flex-grow: 0;
}

.TourModeToggle__switch::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #9886dc;
  border: 1px solid #9886dc;
  border-radius: 14px;
  box-sizing: border-box;
}

.TourModeToggle__thumb {
  position: absolute;
  left: 1px;
  top: 1px;
  width: calc(50% - 3px);
  height: calc(100% - 3px);
  background: #ffffff;
  border: 1px solid #9886dc;
  border-radius: 12px;
  box-sizing: border-box;
  transition: transform 0.25s ease;
  z-index: 1;
}

.TourModeToggle__switch.world .TourModeToggle__thumb {
  transform: translateX(calc(100% + 4px));
}
</style>
