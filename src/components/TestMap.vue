<script setup>
import { ref, onMounted, createApp } from 'vue';
import { Loader } from '@googlemaps/js-api-loader'
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { storeToRefs } from 'pinia'
import { useNewsListStore } from '@/store/newsListStore';
import MarkerPopup from './MarkerPopup.vue'
import ClusterPopup from './ClusterPopup.vue';
import ControlPopup from './ControlPopup.vue';

const { articles } = storeToRefs(useNewsListStore())

const mapDiv = ref(null);

const loader = new Loader({
  apiKey: 'AIzaSyDH9fUnHstrmNdS8qGou60swHdvZlVK9Y8',
  version: 'weekly',
})

let map = null;

// const locations = ref([
//   { lat: 37.517864, lng: 126.972226 },
//   { lat: 37.496640, lng: 127.028218 },
//   { lat: 37.496740, lng: 127.031304 },
// ])

const library = {
  Map: null,
  AdvancedMarkerElement: null,
}

let overlay = null;

const closeOverlay = () => {
  if (overlay) {
    overlay.close();
    overlay = null;
  }
};

onMounted(async () => {
  const { Map, OverlayView } = await loader.importLibrary("maps");
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");

  class CustomOverlay extends OverlayView {
    position;
    div;
    constructor(position, content, map) {
      super();
      this.position = position;
      this.content = content;
      this.map = map;
      this.div = null;
      this.setMap(map);
    }

    onAdd() {
      this.div = document.createElement('div');
      this.div.style.position = 'absolute';
      this.div.style.pointerEvents = 'auto'; // 클릭 이벤트 허용
      this.div.appendChild(this.content);
      CustomOverlay.preventMapHitsAndGesturesFrom(this.div);
      const panes = this.getPanes();
      panes.floatPane.appendChild(this.div);
    }

    draw() {
      if (this.div) {
        const overlayProjection = this.getProjection();
        const position = overlayProjection.fromLatLngToDivPixel(this.position);
        this.div.style.left = `${position.x - 180}px`;
        this.div.style.top = `${position.y - 335}px`;
        this.div.style.zIndex = '1000';
      }
    }

    onRemove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }

    close() {
      this.setMap(null);
    }
  }

  library.Map = Map
  library.AdvancedMarkerElement = AdvancedMarkerElement
  map = new library.Map(mapDiv.value, {
    center: { lat: 37.66727, lng: 127.07242 },
    zoom: 10,
    mapId: "503c7df556477029",
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
  })

  for (const article of articles.value) {
    const markerTag = document.createElement("div");
    markerTag.classList.add("marker");
    markerTag.setAttribute('article_title', article.title)
    markerTag.setAttribute('article_url', article.url)
    article.marker = new library.AdvancedMarkerElement({
      map,
      position: article.position,
      content: markerTag
    })
    article.marker.addListener("click", () => {
      closeOverlay();

      const container = document.createElement("div");
      const app = createApp(MarkerPopup, {
        closeWindow: closeOverlay,
        article: article,
      });
      app.mount(container)

      overlay = new CustomOverlay(
        article.position,
        container,
        map
      );
    })
  }

  const renderer = {
  render: ({ count, position }) => {
    const clusterTag = document.createElement("div");
    clusterTag.classList.add("cluster");
    clusterTag.innerHTML = `
      <div>${String(count)}<div>
    `
    const mark = new library.AdvancedMarkerElement({
      map,
      content: clusterTag,
      position,
      zIndex: 1000 + count,
    })

    return mark
  }
}

const onClickCluster = (e, cluster) => {
  closeOverlay()

  const clusterPosition = { lat: cluster.position.lat(), lng: cluster.position.lng() }
  const clusterArticles = cluster.markers.map(({ content }) => {
    return { title: content.getAttribute('article_title'), url: content.getAttribute('article_url') }
  })

  const container = document.createElement("div");
  const app = createApp(ClusterPopup, {
    closeWindow: closeOverlay,
    articles: clusterArticles,
  });
  app.mount(container)

  overlay = new CustomOverlay(
    clusterPosition,
    container,
    map
  );
}

  new MarkerClusterer({ map, markers: articles.value.map(({ marker }) => marker), renderer, onClusterClick: onClickCluster })
})


</script>

<template>
  <div class="map" ref="mapDiv"></div>
  <ControlPopup />
</template>

<style lang="scss" scoped>
div:deep(.marker) {
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #FF7272;
  align-items: center;
  justify-content: center;
}

div:deep(.cluster) {
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #FF7272;
  border: 2px solid #000000;
  color: black;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
}

.map {
  width: 100vw;
  height: 100vh;
  z-index: 1;
}
</style>