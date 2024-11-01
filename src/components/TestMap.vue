<script setup>
import { ref, onMounted, createApp } from 'vue';
import { Loader } from '@googlemaps/js-api-loader'
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { storeToRefs } from 'pinia'
import { useNewsListStore } from '@/store/newsListStore';
import MarkerPopup from './MarkerPopup.vue'
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

const renderer = {
  render: ({ count, position, markers }) => {
    const clusterTag = document.createElement("div");
    clusterTag.classList.add("cluster");
    let innerHTML = `
      <div>${String(count)}<div>
      <div class="detail">
    `
    markers.forEach((marker) => {
      innerHTML = innerHTML + `
          <div>${marker.content.getAttribute('title')}</div>
      `
    })
    clusterTag.innerHTML = innerHTML + `
      </div>`
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
  // map.fitBounds(cluster.bounds)
  cluster.markers.forEach((marker) => {
    console.log(marker.content.getAttribute('title'))
  })
  if (cluster.marker.content.classList.contains("popup")) {
    cluster.marker.content.classList.remove("popup");
    cluster.marker.zIndex = null;
  } else {
    cluster.marker.content.classList.add("popup");
    cluster.marker.zIndex = 1;
  }
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
      panes.overlayLayer.appendChild(this.div);
    }

    draw() {
      if (this.div) {
        const overlayProjection = this.getProjection();
        const position = overlayProjection.fromLatLngToDivPixel(this.position);
        this.div.style.left = `${position.x}px`;
        this.div.style.top = `${position.y - 400}px`;
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
    // markerTag.innerHTML = `
    //   <div class="detail">
    //     <div>${article.title}<div>
    //   </div>`
    markerTag.setAttribute('title', article.title)
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
      });
      app.mount(container)

      overlay = new CustomOverlay(
        article.position,
        container,
        map
      );
      // infowindow = new InfoWindow({
      //   content: container
      // });
      // infowindow.open(map, article.marker)

      // if (article.marker.content.classList.contains("popup")) {
      //   article.marker.content.classList.remove("popup");
      //   article.marker.zIndex = null;
      // } else {
      //   article.marker.content.classList.add("popup");
      //   article.marker.zIndex = 1;
      // }
    })
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

:deep(.marker .detail) {
  display: none;
  flex-direction: column;
  flex: 1;
}

:deep(.marker.popup .detail) {
  position: relative;
  display: flex;
  color: #FFEFEB;
  font-size: 14px;
  width: 400px;
  height: 368px;
  border: solid 1px #4E5277;
  background-color: #313457;
  border-radius: 2px;
  top: -390px;
  left: -168px;
}

:deep(.marker.popup .detail::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-top-color: #313457;
  border-bottom: 0;
  border-left: 0;
  margin-left: -10px;
  margin-bottom: -20px;
  z-index: 2;
}

:deep(.marker.popup .detail::before) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 0;
  border: 22px solid transparent;
  border-top-color: #4E5277;
  border-bottom: 0;
  border-left: 0;
  margin-left: -11px;
  margin-bottom: -22px;
  z-index: 1;
}

:deep(.cluster .detail) {
  display: none;
  flex-direction: column;
  flex: 1;
}

:deep(.cluster.popup .detail) {
  position: relative;
  display: flex;
  width: 400px;
  height: 368px;
  border: solid 1px #4E5277;
  background-color: #313457;
  border-radius: 2px;
  top: -410px;
  left: -168px;
}

:deep(.cluster.popup .detail::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-top-color: #313457;
  border-bottom: 0;
  border-left: 0;
  margin-left: -10px;
  margin-bottom: -20px;
  z-index: 2;
}

:deep(.cluster.popup .detail::before) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 0;
  border: 22px solid transparent;
  border-top-color: #4E5277;
  border-bottom: 0;
  border-left: 0;
  margin-left: -11px;
  margin-bottom: -22px;
}
</style>