<script setup>
import { ref, onMounted, createApp } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { storeToRefs } from 'pinia';
import { useNewsListStore } from '@/store/newsListStore';
import MarkerPopup from './MarkerPopup.vue';
import ControlPopup from './ControlPopup.vue';

const { loadArticles } = useNewsListStore();
const { articles, filteredArticles } = storeToRefs(useNewsListStore());

const mapDiv = ref(null);

const loader = new Loader({
  apiKey: process.env.VUE_APP_API_KEY,
  version: 'weekly',
});

let map = null;

const library = {
  Map: null,
  AdvancedMarkerElement: null,
};
const markerColor = {
  바바리맨: '#FF7272',
  헌팅: '#1CD6FF',
  미행: '#B56BFF',
  폭행: '#FFED89',
};
const clusters = {
  바바리맨: null,
  헌팅: null,
  미행: null,
  폭행: null,
  기타: null,
};

let overlay = null;

const closeOverlay = () => {
  if (overlay) {
    overlay.close();
    overlay = null;
  }
};

onMounted(async () => {
  await loadArticles();
  const { Map, OverlayView } = await loader.importLibrary('maps');
  const { AdvancedMarkerElement } = await loader.importLibrary('marker');

  class CustomOverlay extends OverlayView {
    position;
    div;
    constructor(position, content, map, num) {
      super();
      this.position = position;
      this.content = content;
      this.map = map;
      this.div = null;
      this.num = num;
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

        const popupHeight = this.div.offsetHeight;

        const offsetX = 16;
        const offsetY = popupHeight / 2;

        const gap = 20;
        this.div.style.left = `${position.x + offsetX + gap}px`;
        this.div.style.top = `${position.y - offsetY}px`;
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

  library.Map = Map;
  library.AdvancedMarkerElement = AdvancedMarkerElement;
  map = new library.Map(mapDiv.value, {
    center: { lat: 36.36727, lng: 127.07242 },
    zoom: 7.5,
    mapId: '503c7df556477029',
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
  });

  for (const article of articles.value) {
    const markerTag = document.createElement('div');
    markerTag.classList.add('marker');
    if (Object.keys(markerColor).includes(article.category)) {
      markerTag.style.backgroundColor = markerColor[article.category];
    }
    markerTag.setAttribute('article_title', article.title);
    markerTag.setAttribute('article_url', article.url);
    markerTag.setAttribute('article_data', article.date);
    article.marker = new library.AdvancedMarkerElement({
      map,
      position: article.position,
      content: markerTag,
    });
    article.marker.addListener('click', () => {
      closeOverlay();

      const container = document.createElement('div');
      const app = createApp(MarkerPopup, {
        closeWindow: closeOverlay,
        article: article,
      });
      app.mount(container);

      overlay = new CustomOverlay(article.position, container, map, 1);
    });
  }

  const renderer = {
    render: ({ count, position, markers }) => {
      const clusterTag = document.createElement('div');
      clusterTag.classList.add('cluster');
      const size = Math.min(16 + count, 200);
      clusterTag.innerHTML = `
      <div style="line-height: ${size}px">${String(count)}<div>
    `;
      clusterTag.style.backgroundColor =
        markers[0].content.style.backgroundColor;
      clusterTag.style.width = size + 'px';
      clusterTag.style.height = size + 'px';
      const mark = new library.AdvancedMarkerElement({
        map,
        content: clusterTag,
        position,
        zIndex: 1000 + count,
      });

      return mark;
    },
  };

  const onClickCluster = (e, cluster) => {
    closeOverlay();

    const clusterPosition = {
      lat: cluster.position.lat(),
      lng: cluster.position.lng(),
    };

    // 클러스터 내 마커들의 원본 기사 데이터를 찾아서 전달
    const clusterArticles = cluster.markers.map((marker) => {
      // marker의 content에서 title을 가져와서 원본 데이터 찾기
      const title = marker.content.getAttribute('article_title');
      return articles.value.find((article) => article.title === title);
    });

    const container = document.createElement('div');
    const app = createApp(MarkerPopup, {
      closeWindow: closeOverlay,
      article: clusterArticles, // 완전한 기사 객체 배열 전달
    });
    app.mount(container);

    overlay = new CustomOverlay(clusterPosition, container, map, cluster.count);
  };

  clusters.바바리맨 = new MarkerClusterer({
    map,
    markers: articles.value
      .filter(({ category }) => {
        return category === '바바리맨';
      })
      .map(({ marker }) => marker),
    renderer,
    onClusterClick: onClickCluster,
  });
  clusters.미행 = new MarkerClusterer({
    map,
    markers: articles.value
      .filter(({ category }) => {
        return category === '미행';
      })
      .map(({ marker }) => marker),
    renderer,
    onClusterClick: onClickCluster,
  });
  clusters.헌팅 = new MarkerClusterer({
    map,
    markers: articles.value
      .filter(({ category }) => {
        return category === '헌팅';
      })
      .map(({ marker }) => marker),
    renderer,
    onClusterClick: onClickCluster,
  });
  clusters.폭행 = new MarkerClusterer({
    map,
    markers: articles.value
      .filter(({ category }) => {
        return category === '폭행';
      })
      .map(({ marker }) => marker),
    renderer,
    onClusterClick: onClickCluster,
  });
  clusters.기타 = new MarkerClusterer({
    map,
    markers: articles.value
      .filter(({ category }) => {
        return category === '기타';
      })
      .map(({ marker }) => marker),
    renderer,
    onClusterClick: onClickCluster,
  });
  filteredArticles.value = [...articles.value];
});

const changeFilter = (crimeTypes, selectedSido, dongList) => {
  filteredArticles.value = [];
  const filterSido = selectedSido;
  const filterSigungu = dongList
    .filter(({ checked }) => checked)
    .map(({ name }) => name);
  const filterCrime = crimeTypes
    .filter(({ checked }) => checked)
    .map(({ crimeType }) => crimeType);
  if (filterCrime.length === crimeTypes.length) {
    filterCrime.push('기타');
  }

  Object.keys(clusters).forEach((crimeType) => {
    // filter에서 선택되지 않은 crimeType 거르기
    if (!filterCrime.includes(crimeType)) {
      clusters[crimeType].clearMarkers();
      return;
    }
    const updatedArticles = articles.value.filter((article) => {
      if (filterSigungu.length === dongList.length) {
        return article.category === crimeType && filterSido === article.sido;
      }
      return (
        article.category === crimeType &&
        filterSido === article.sido &&
        filterSigungu.includes(article.sigungu)
      );
    });

    filteredArticles.value = [...filteredArticles.value, ...updatedArticles];

    clusters[crimeType].clearMarkers();
    clusters[crimeType].addMarkers(updatedArticles.map(({ marker }) => marker));
  });
};
</script>

<template>
  <div class="map" ref="mapDiv"></div>
  <ControlPopup @change-filter="changeFilter" />
</template>

<style lang="scss" scoped>
div:deep(.marker) {
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #00ffc2;
  align-items: center;
  justify-content: center;
}

div:deep(.cluster) {
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #00ffc2;
  border: 2px solid #000000;
  color: black;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
}

.map {
  /* width: 100vw; */
  height: 100vh;
  z-index: 1;
}
</style>
