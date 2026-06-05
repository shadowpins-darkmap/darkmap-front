<template>
  <div
    ref="outerRef"
    class="carousel-wrap"
    @mouseenter="pauseAuto"
    @mouseleave="resumeAuto"
  >
    <!-- 카드 트랙 -->
    <div class="carousel-track-outer">
      <div
        class="carousel-track"
        :style="trackStyle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown="onMouseDown"
      >
        <div
          v-for="(item, index) in topPosts"
          :key="item.boardId ?? item.id ?? index"
          class="carousel-card"
          :class="{ green: green }"
          :style="cardStyle"
          @click.stop="handleCardClick(item, $event)"
        >
          <!-- 카드 헤더: 카테고리 + 화살표 -->
          <div class="card-header">
            <span class="card-tag">{{ item.category || item.tag || '미분류' }}</span>
            <img
              src="@/assets/slideCardArrow.svg"
              class="card-arrow"
              alt="상세보기"
              width="12"
              height="12"
            />
          </div>

          <!-- 카드 본문 -->
          <div class="card-body">
            <div class="card-text">
              <p class="card-title ellipsis-2">{{ item.title }}</p>
              <p class="card-preview ellipsis-1">{{ item.content }}</p>
            </div>
            <div v-if="item.imageUrl" class="card-thumbnail">
              <img :src="item.imageUrl" alt="게시글 이미지" />
            </div>
          </div>

          <!-- 카드 푸터: 닉네임, 날짜, 조회수, 좋아요 -->
          <div class="card-footer">
            <span class="card-nickname">{{ item.authorNickname || '익명' }}</span>
            <span class="card-date">{{ formatDate(item.createdAt) }}</span>
            <span class="card-stats">
              <span class="stat-views">조회수 {{ item.viewCount ?? 0 }}</span>
              <span class="stat-likes">
                <img
                  src="@/assets/heartButtonIcon.svg"
                  alt="좋아요"
                  width="10"
                  height="10"
                />
                {{ item.likeCount ?? 0 }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 닷 인디케이터 -->
    <div class="carousel-dots" v-if="topPosts.length > 0">
      <button
        v-for="(_, i) in topPosts"
        :key="i"
        class="carousel-dot"
        :class="{ active: i === currentIndex }"
        @click="goTo(i)"
        :aria-label="`${i + 1}번 슬라이드`"
      />
    </div>

    <!-- 로딩 / 빈 상태 -->
    <div v-if="loading" class="carousel-empty">불러오는 중...</div>
    <div v-else-if="topPosts.length === 0 && !auth.isLoggedIn" class="carousel-empty">
      로그인하면 인기글을 볼 수 있어요
    </div>
    <div v-else-if="topPosts.length === 0" class="carousel-empty">게시글이 없습니다</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import api from '@/lib/api';
import { boardsApi } from '@/api/boards';
import { useAuthStore } from '@/store/useAuthStore';

const props = defineProps({
  green: {
    type: Boolean,
    default: false,
  },
  itemsToShow: {
    type: Number,
    default: 1,
  },
  gap: {
    type: Number,
    default: 8,
  },
  onCardClick: {
    type: Function,
    default: null,
  },
  autoInterval: {
    type: Number,
    default: 2000,
  },
  limit: {
    type: Number,
    default: 5,
  },
});

const auth = useAuthStore();
const topPosts = ref([]);
const loading = ref(false);
const currentIndex = ref(0);
const outerRef = ref(null);
const containerWidth = ref(0);
let autoTimer = null;
let resizeObserver = null;

// ─── 드래그 상태 ───────────────────────────────────────────
const dragState = ref({
  startX: 0,
  currentX: 0,
  isDragging: false,
  hasMoved: false,
});

// ─── 카드 크기 계산 (px 기반) ──────────────────────────────
const PEEK = 20; // 양 옆 인접 카드 노출 px
const GAP = 8;
const cardWidth = computed(() =>
  containerWidth.value > 0 ? containerWidth.value - PEEK * 2 - GAP : 260
);
const slideStep = computed(() => cardWidth.value + GAP);

const cardStyle = computed(() => ({
  flex: `0 0 ${cardWidth.value}px`,
  width: `${cardWidth.value}px`,
}));

// ─── trackStyle: 첫 카드는 PEEK만큼 들여쓰기, 이후 slideStep씩 이동 ──
const trackStyle = computed(() => {
  const dragDelta = dragState.value.isDragging
    ? dragState.value.currentX - dragState.value.startX
    : 0;
  const basePx = PEEK - currentIndex.value * slideStep.value + dragDelta;
  return {
    transform: `translateX(${basePx}px)`,
    transition: dragState.value.isDragging
      ? 'none'
      : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    gap: `${GAP}px`,
  };
});

// ─── 날짜 포맷 ─────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yy}.${mm}.${dd} ${hh}:${min}`;
};

// ─── 슬라이드 이동 ─────────────────────────────────────────
const goTo = (index) => {
  const max = topPosts.value.length - 1;
  currentIndex.value = Math.max(0, Math.min(index, max));
};

const next = () => {
  if (topPosts.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % topPosts.value.length;
};

// ─── 자동 재생 ─────────────────────────────────────────────
const startAuto = () => {
  stopAuto();
  autoTimer = setInterval(next, props.autoInterval);
};

const stopAuto = () => {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
};

const pauseAuto = () => stopAuto();
const resumeAuto = () => startAuto();

// ─── 드래그 공통 로직 ──────────────────────────────────────
const onDragStart = (clientX) => {
  dragState.value = {
    startX: clientX,
    currentX: clientX,
    isDragging: true,
    hasMoved: false,
  };
  pauseAuto();
};

const onDragMove = (clientX) => {
  if (!dragState.value.isDragging) return;
  dragState.value.currentX = clientX;
  const delta = Math.abs(clientX - dragState.value.startX);
  if (delta > 10) {
    dragState.value.hasMoved = true;
  }
};

const onDragEnd = () => {
  if (!dragState.value.isDragging) return;

  const delta = dragState.value.currentX - dragState.value.startX;

  if (Math.abs(delta) > 50) {
    if (delta < 0) {
      next();
    } else {
      goTo(currentIndex.value - 1);
    }
  }

  dragState.value.isDragging = false;
  resumeAuto();

  setTimeout(() => {
    dragState.value.hasMoved = false;
  }, 50);
};

// ─── 터치 이벤트 ───────────────────────────────────────────
const onTouchStart = (e) => {
  onDragStart(e.touches[0].clientX);
};

const onTouchMove = (e) => {
  if (!dragState.value.isDragging) return;
  const delta = e.touches[0].clientX - dragState.value.startX;
  // 수평 드래그가 확실할 때만 스크롤 막기
  if (Math.abs(delta) > 5) {
    e.preventDefault();
  }
  onDragMove(e.touches[0].clientX);
};

const onTouchEnd = () => {
  onDragEnd();
};

// ─── 마우스 이벤트 ─────────────────────────────────────────
const onMouseDown = (e) => {
  e.preventDefault();
  onDragStart(e.clientX);
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('mouseup', onDocumentMouseUp);
};

const onDocumentMouseMove = (e) => {
  onDragMove(e.clientX);
};

const onDocumentMouseUp = () => {
  onDragEnd();
  document.removeEventListener('mousemove', onDocumentMouseMove);
  document.removeEventListener('mouseup', onDocumentMouseUp);
};

// ─── 클릭 핸들러 ───────────────────────────────────────────
const handleCardClick = (item, e) => {
  if (dragState.value.hasMoved) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  if (props.onCardClick) {
    props.onCardClick(item);
  }
};

// ─── 데이터 정규화 ─────────────────────────────────────────
const normalizeBoard = (board) => ({
  id: board.id,
  boardId: board.boardId ?? board.id,
  category: board.category || board.tag || '미분류',
  title: board.title || '',
  content: board.content || '',
  imageUrl: board.imageUrl || board.url || '',
  authorNickname: board.authorNickname || board.nickname || board.user || '익명',
  authorDeleted: board.authorDeleted,
  authorAnonymized: board.authorAnonymized,
  authorId: board.authorId ?? board.userId ?? board.writerId,
  createdAt: board.createdAt,
  viewCount: board.viewCount || 0,
  likeCount: board.likeCount || 0,
  commentCount: board.commentCount || 0,
});

// ─── API 호출 ──────────────────────────────────────────────
const loadPopularBoards = async () => {
  const response = await boardsApi.getPopularBoards(props.limit * 2);
  if (response && Array.isArray(response.data)) {
    return response.data.map(normalizeBoard);
  }
  return [];
};

const loadRecentBoards = async () => {
  const { data } = await api.get('/api/v1/boards/recent', {
    params: { page: 1, size: 50, sortBy: 'createdAt', direction: 'DESC' },
    _retry: true,
  });
  const boards = data?.data?.boards || [];
  return boards.map(normalizeBoard);
};

const fetchTopPosts = async () => {
  loading.value = true;
  try {
    let boards = await loadPopularBoards();
    if (!boards.length) {
      boards = await loadRecentBoards().catch(() => []);
    }
    topPosts.value = [...boards]
      .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
      .slice(0, props.limit);
  } catch (err) {
    console.error('[CarouselWrap] 인기 게시글 로딩 실패:', err);
    topPosts.value = [];
  } finally {
    loading.value = false;
    if (topPosts.value.length > 0) startAuto();
  }
};

// ─── 라이프사이클 ──────────────────────────────────────────
const measureContainer = () => {
  if (outerRef.value) {
    containerWidth.value = outerRef.value.offsetWidth;
  }
};

onMounted(async () => {
  // 컨테이너 너비 먼저 측정
  await nextTick();
  measureContainer();
  resizeObserver = new ResizeObserver(measureContainer);
  if (outerRef.value) resizeObserver.observe(outerRef.value);

  await fetchTopPosts();
});

onBeforeUnmount(() => {
  stopAuto();
  resizeObserver?.disconnect();
  document.removeEventListener('mousemove', onDocumentMouseMove);
  document.removeEventListener('mouseup', onDocumentMouseUp);
});

// ─── 외부 노출 API ─────────────────────────────────────────
const updateCard = (boardId, updates) => {
  const index = topPosts.value.findIndex((post) => post.boardId === boardId || post.id === boardId);
  if (index !== -1) {
    topPosts.value[index] = { ...topPosts.value[index], ...updates };
  }
};

const removeCard = (boardId) => {
  topPosts.value = topPosts.value.filter((post) => post.boardId !== boardId && post.id !== boardId);
  if (currentIndex.value >= topPosts.value.length) {
    currentIndex.value = Math.max(0, topPosts.value.length - 1);
  }
};

defineExpose({ goTo, next, updateCard, removeCard, reload: fetchTopPosts });
</script>

<style scoped lang="scss">
.carousel-wrap {
  position: relative;
  width: 100%;
  user-select: none;
}

.carousel-track-outer {
  width: 100%;
  overflow: hidden;        /* 여기서만 카드 클리핑 */
  padding: 8px 0 10px;    /* 상하 여백 — 그림자가 잘리지 않도록 */
}

.carousel-track {
  display: flex;
  will-change: transform;
  cursor: grab;
  touch-action: pan-y;
  align-items: stretch;

  &:active {
    cursor: grabbing;
  }
}

/* ── 기본(외부, 분홍) 테마 ── */
.carousel-card {
  flex-shrink: 0;
  /* width/flex-basis는 :style="cardStyle"로 JS에서 동적 지정 */
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid #f1cfc8;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s;
  color: #fff;
  user-select: none;
  -webkit-user-drag: none;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
  }

  img {
    -webkit-user-drag: none;
    pointer-events: none;
  }

  /* ── 초록(내부, 리스트패널) 테마 ── */
  &.green {
    background: #01523e;
    border-color: #00ffc2;

    .card-tag {
      border-color: #00ffc2;
      color: #00ffc2;
    }

    .card-footer {
      border-top-color: #00ffc2;
    }

    .card-nickname,
    .card-date {
      color: #00ffc2;
    }

    .stat-views,
    .stat-likes {
      color: #00ffc2;
    }
  }
}

/* 카드 헤더 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-tag {
  display: inline-flex;
  align-items: center;
  border: 1px solid #f1cfc8;
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #f1cfc8;
  letter-spacing: -0.5px;
}

.card-arrow {
  opacity: 0.5;
}

/* 카드 본문 */
.card-body {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
}

.card-text {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  color: #fff;
  margin-bottom: 4px;
  word-break: keep-all;
}

.card-preview {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.card-thumbnail {
  flex: 0 0 72px;
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* 카드 푸터 */
.card-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  border-top: 1px solid #f1cfc8;
  padding-top: 8px;
  margin-top: 4px;
}

.card-nickname {
  font-size: 11px;
  font-weight: 600;
  color: #f1cfc8;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-date {
  font-size: 11px;
  color: #f1cfc8;
  flex-shrink: 0;
}

.card-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.stat-views,
.stat-likes {
  font-size: 11px;
  color: #f1cfc8;
  display: flex;
  align-items: center;
  gap: 3px;
}

/* 닷 인디케이터 */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 4px;
}

.carousel-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background 0.25s, transform 0.25s;

  &.active {
    background: #fff;
    transform: scale(1.3);
  }
}

/* 유틸 */
.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ellipsis-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 빈 상태 */
.carousel-empty {
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  padding: 16px 0;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>