<template>
  <section class="WorldTourInfoPanel">
    <strong class="WorldTourInfoPanel__title">{{
      t('worldTour.title')
    }}</strong>
    <p class="WorldTourInfoPanel__count">
      {{ t('worldTour.countLabel', { n: totalCount }) }}
    </p>

    <WorldTourFAQ
      :faq-items="worldFaqContent"
      @open="$emit('openFaq', $event)"
    />

    <CountryTabs
      :countries="worldCountries"
      :selected-country="selectedCountry"
      @change="$emit('changeCountry', $event)"
    />

    <div class="WorldTourInfoPanel__cases scroll_area">
      <CyberFlashingCaseCard
        v-for="item in countryCases"
        :key="`${item.date}-${item.summary}`"
        :date="item.date"
        :summary="item.summary"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import CountryTabs from './CountryTabs.vue';
import CyberFlashingCaseCard from './CyberFlashingCaseCard.vue';
import WorldTourFAQ from './WorldTourFAQ.vue';
import {
  cyberFlashingCases,
  worldCountries,
  worldFaqContent,
} from '@/constant/worldTourData';
import { useTranslation } from '@/composables/useTranslation';

const props = defineProps({
  selectedCountry: {
    type: String,
    required: true,
  },
});

defineEmits(['changeCountry', 'openFaq']);

const { t } = useTranslation();

const countryCases = computed(
  () => cyberFlashingCases[props.selectedCountry] || cyberFlashingCases.England,
);
const totalCount = computed(() =>
  Object.values(cyberFlashingCases).reduce(
    (count, cases) => count + (cases?.length || 0),
    0,
  ),
);
</script>

<style scoped lang="scss">
.WorldTourInfoPanel {
  width: 320px;
  padding: 15px;
  border: 2px solid #2f7568;
  border-radius: 16px;
  background: #0f1419;
  color: #fff;
}

.WorldTourInfoPanel__title {
  display: block;
  font-size: 20px;
  color: #00ffc2;
  margin-bottom: 8px;
}

.WorldTourInfoPanel__count {
  font-size: 12px;
  margin-bottom: 12px;
  color: #b7ffe9;
}

.WorldTourInfoPanel__cases {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 4px;
}
</style>
