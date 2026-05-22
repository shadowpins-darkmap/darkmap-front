<script setup>
import { ref, onMounted, createApp, watch } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { storeToRefs } from 'pinia';
import { useNewsListStore } from '@/store/newsListStore';
import MarkerPopup from './MarkerPopup.vue';
import ControlPopup from './ControlPopup.vue';
import BaseLoader from './BaseLoader.vue';
import { useTourModeStore } from '@/store/useTourModeStore';
import { useCyberFlashingStore } from '@/store/useCyberFlashingStore';
import WorldTourMapPopup from '@/components/worldTour/WorldTourMapPopup.vue';
import pinia from '@/store';

const { loadArticles } = useNewsListStore();
const { articles, filteredArticles } = storeToRefs(useNewsListStore());

const mapDiv = ref(null);
const isLoading = ref(false);
const tourModeStore = useTourModeStore();
const cyberFlashingStore = useCyberFlashingStore();

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
let worldTourMarkers = [];

const closeOverlay = () => {
  if (overlay) {
    overlay.close();
    overlay = null;
  }
};

const setKoreaMarkersVisible = (visible) => {
  articles.value.forEach(({ marker }) => {
    if (marker) {
      marker.map = visible ? map : null;
    }
  });

  Object.values(clusters).forEach((cluster) => {
    if (!cluster) return;
    cluster.clearMarkers();
  });

  if (visible) {
    Object.keys(clusters).forEach((crimeType) => {
      if (!clusters[crimeType]) return;
      clusters[crimeType].addMarkers(
        articles.value
          .filter(({ category, marker }) => category === crimeType && marker)
          .map(({ marker }) => marker),
      );
    });
  }
};

const setWorldTourMarkersVisible = (visible) => {
  worldTourMarkers.forEach((marker) => {
    marker.map = visible ? map : null;
  });
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

// 단일 마커 생성 함수
const createSingleMarker = (article) => {
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
};

// 마커 배치 생성 함수
const createMarkersBatched = async (articlesList, batchSize = 50) => {
  for (let i = 0; i < articlesList.length; i += batchSize) {
    const batch = articlesList.slice(i, i + batchSize);
    batch.forEach(createSingleMarker);

    // 다음 배치 전에 브라우저에게 제어권 반환
    await new Promise((resolve) => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(resolve);
      } else {
        setTimeout(resolve, 0);
      }
    });
  }
};

// 서울시청 기본 좌표
const SEOUL_CITY_HALL = { lat: 37.5663, lng: 126.9779 };
const DEFAULT_ZOOM = 14; // 더 가까운 줌 레벨
const WORLD_CENTER = { lat: 48, lng: 14 };
const WORLD_ZOOM = 4.1;
const WORLD_USER_ZOOM = 4.4;
let initialLocation = SEOUL_CITY_HALL;
let hasGpsLocation = false;

// 사용자 위치 가져오기 (실패 시 서울시청 반환)
const getUserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ location: SEOUL_CITY_HALL, fromGps: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          fromGps: true,
        });
      },
      () => {
        // 위치 권한 거부 또는 오류 시 서울시청으로 fallback
        resolve({ location: SEOUL_CITY_HALL, fromGps: false });
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

const getWorldMarkerSize = (count) => {
  if (!count) return 0;
  return Math.max(22, Math.min(160, 16 + Math.sqrt(count) * 7));
};

const createWorldTourMarkerContent = (country) => {
  const markerTag = document.createElement('button');
  const size = getWorldMarkerSize(country.count);
  markerTag.classList.add('world-tour-marker');
  markerTag.type = 'button';
  markerTag.style.width = `${size}px`;
  markerTag.style.height = `${size}px`;
  markerTag.style.lineHeight = `${size}px`;
  markerTag.textContent = String(country.count);
  markerTag.setAttribute(
    'aria-label',
    `${country.countryName}: ${country.count} cyberflashing cases`,
  );
  return markerTag;
};

const createWorldTourMarkers = () => {
  worldTourMarkers.forEach((marker) => {
    marker.map = null;
  });
  worldTourMarkers = cyberFlashingStore.countrySummaries.map((country) => {
    const position = { lat: country.lat, lng: country.lng };
    const marker = new library.AdvancedMarkerElement({
      map: tourModeStore.isWorldTour ? map : null,
      position,
      content: createWorldTourMarkerContent(country),
      anchorLeft: '-50%',
      anchorTop: '-50%',
      zIndex: 2000 + country.count,
    });

    marker.addListener('click', () => {
      closeOverlay();

      const container = document.createElement('div');
      const app = createApp(WorldTourMapPopup, {
        closeWindow: closeOverlay,
        country,
      });
      app.use(pinia);
      app.mount(container);

      overlay = new CustomOverlay(position, container, map, country.count);
    });

    return marker;
  });
};

const applyTourModeToMap = () => {
  closeOverlay();

  if (tourModeStore.isWorldTour) {
    map.setCenter(hasGpsLocation ? initialLocation : WORLD_CENTER);
    map.setZoom(hasGpsLocation ? WORLD_USER_ZOOM : WORLD_ZOOM);
    setKoreaMarkersVisible(false);
    setWorldTourMarkersVisible(true);
    return;
  }

  map.setCenter(initialLocation);
  map.setZoom(DEFAULT_ZOOM);
  setWorldTourMarkersVisible(false);
  setKoreaMarkersVisible(true);
};

onMounted(async () => {
  try {
    // 1. 위치 가져오기와 Google Maps 라이브러리를 병렬로 로드
    const locationPromise = getUserLocation();

    // 2. Google Maps 라이브러리 로드
    const [{ Map, OverlayView }, { AdvancedMarkerElement }, userLocationResult] =
      await Promise.all([
        loader.importLibrary('maps'),
        loader.importLibrary('marker'),
        locationPromise,
      ]);
    initialLocation = userLocationResult.location;
    hasGpsLocation = userLocationResult.fromGps;

    initCustomOverlay(OverlayView);

    library.Map = Map;
    library.AdvancedMarkerElement = AdvancedMarkerElement;

    // 3. 지도를 즉시 생성하고 표시
    map = new library.Map(mapDiv.value, {
      center: tourModeStore.isWorldTour
        ? hasGpsLocation
          ? initialLocation
          : WORLD_CENTER
        : initialLocation,
      zoom: tourModeStore.isWorldTour
        ? hasGpsLocation
          ? WORLD_USER_ZOOM
          : WORLD_ZOOM
        : DEFAULT_ZOOM,
      mapId: '503c7df556477029',
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    });
    map.addListener('click', closeOverlay);

    // 4. 지도가 표시된 후 백그라운드에서 기사 로딩
    isLoading.value = true;
    await Promise.all([loadArticles(), cyberFlashingStore.fetchAllCases()]);
    isLoading.value = false;

    // 5. 마커를 배치로 생성 (UI 블로킹 방지)
    await createMarkersBatched(articles.value);

    // 6. 모든 마커 생성 완료 후 클러스터 생성
    createClusters();
    createWorldTourMarkers();
    applyTourModeToMap();
  } catch (error) {
    console.error('Google Maps 로딩 실패:', error);
    isLoading.value = false;
  }
});

watch(
  () => tourModeStore.mode,
  () => {
    if (!map) return;
    applyTourModeToMap();
  },
);

const changeFilter = (crimeTypes, selectedSido, dongList) => {
  filteredArticles.value = [];
  const filterSido = selectedSido;
  const isAllRegions = filterSido === '전국';
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
      if (article.category !== crimeType) return false;
      const allChecked = filterSigungu.length === dongList.length;
      if (isAllRegions) {
        // "전국" 선택 시 filterSigungu는 시/도(lv1) 이름 목록
        return allChecked || filterSigungu.includes(article.sido);
      }
      if (allChecked) {
        return filterSido === article.sido;
      }
      return (
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
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
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

div:deep(.world-tour-marker) {
  display: block;
  border: 0;
  border-radius: 50%;
  background: #ff626d;
  color: #000;
  font-size: 18px;
  font-weight: 800;
  text-align: center;
  box-shadow: none;
  cursor: pointer;
}

.map {
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
