<script setup>
import { ref, onMounted, createApp } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { storeToRefs } from 'pinia';
import { useNewsListStore } from '@/store/newsListStore';
import MarkerPopup from './MarkerPopup.vue';
import ControlPopup from './ControlPopup.vue';
import BaseLoader from './BaseLoader.vue';

const { loadArticles } = useNewsListStore();
const { articles, filteredArticles } = storeToRefs(useNewsListStore());

const mapDiv = ref(null);
const isLoading = ref(false);

const loader = new Loader({
  apiKey: process.env.VUE_APP_GOOGLE_MAP_API_KEY,
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

// CustomOverlay 클래스를 onMounted 밖에서 정의 (OverlayView를 받아서 생성)
let CustomOverlay = null;

const initCustomOverlay = (OverlayView) => {
  CustomOverlay = class extends OverlayView {
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
  };
};

const renderer = {
  render: ({ count, position, markers }) => {
    const clusterTag = document.createElement('div');
    clusterTag.classList.add('cluster');
    const size = Math.min(16 + count, 200);
    clusterTag.innerHTML = `
    <div style="line-height: ${size}px">${String(count)}<div>
  `;
    clusterTag.style.backgroundColor = markers[0].content.style.backgroundColor;
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

// 마커 생성 함수
const createMarkers = () => {
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
};

// 서울시청 기본 좌표
const SEOUL_CITY_HALL = { lat: 37.5663, lng: 126.9779 };
const DEFAULT_ZOOM = 14; // 더 가까운 줌 레벨

// 사용자 위치 가져오기 (실패 시 서울시청 반환)
const getUserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(SEOUL_CITY_HALL);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // 위치 권한 거부 또는 오류 시 서울시청으로 fallback
        resolve(SEOUL_CITY_HALL);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000, // 5분간 캐시 사용
      },
    );
  });
};

// 클러스터 생성 함수
const createClusters = () => {
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
};

onMounted(async () => {
  try {
    // 1. 병렬로 시작: 기사 로딩, 위치 가져오기, Google Maps 라이브러리 로드
    const articlesPromise = loadArticles();
    const locationPromise = getUserLocation();

    // 2. Google Maps 라이브러리 로드
    const [{ Map, OverlayView }, { AdvancedMarkerElement }, userLocation] =
      await Promise.all([
        loader.importLibrary('maps'),
        loader.importLibrary('marker'),
        locationPromise,
      ]);

    initCustomOverlay(OverlayView);

    library.Map = Map;
    library.AdvancedMarkerElement = AdvancedMarkerElement;

    // 3. 사용자 위치 또는 서울시청 기준으로 지도 생성
    map = new library.Map(mapDiv.value, {
      center: userLocation,
      zoom: DEFAULT_ZOOM,
      mapId: '503c7df556477029',
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    });

    // 4. 기사 로딩이 완료될 때까지 대기 (지도는 이미 보임)
    isLoading.value = true;
    await articlesPromise;

    // 5. 기사 로딩 완료 후 마커와 클러스터 생성
    createMarkers();
    createClusters();
  } catch (error) {
    console.error('Google Maps 로딩 실패:', error);
  } finally {
    isLoading.value = false;
  }
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
  <div class="map-container">
    <div v-if="isLoading" class="loader-container">
      <BaseLoader />
    </div>
    <div class="map" ref="mapDiv"></div>
    <ControlPopup @change-filter="changeFilter" />
  </div>
</template>

<style lang="scss" scoped>
.map-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.loader-container {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 20px;
}

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
  width: 100vw;
  height: 100vh;
  z-index: 1;
}
</style>
