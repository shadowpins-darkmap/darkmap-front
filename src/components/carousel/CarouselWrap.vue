<template>
  <div class="carousel-wrap" @mouseenter="pauseAuto" @mouseleave="resumeAuto">
    <!-- 카드 트랙 -->
    <div class="carousel-track-outer">
      <div
        ref="trackRef"
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
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
const trackRef = ref(null);
let autoTimer = null;

// ─── 드래그 상태 ───────────────────────────────────────────
const dragState = ref({
  startX: 0,
  currentX: 0,
  isDragging: false,
  hasMoved: false,
});
const dragOffset = ref(0); // 드래그 중 실시간 px 오프셋

// ─── trackStyle: 드래그 중에는 transition OFF + offset 반영 ──
const trackStyle = computed(() => {
  const baseOffset = currentIndex.value * 100;
  return {
    transform: `translateX(calc(-${baseOffset}% + ${dragOffset.value}px))`,
    transition: dragState.value.isDragging
      ? 'none'
      : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    gap: `${props.gap}px`,
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
  dragOffset.value = 0;
  pauseAuto();
};

const onDragMove = (clientX) => {
  if (!dragState.value.isDragging) return;
  dragState.value.currentX = clientX;
  const delta = clientX - dragState.value.startX;
  dragOffset.value = delta; // 실시간 카드 이동
  if (Math.abs(delta) > 10) {
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

  // offset을 0으로 되돌리면서 transition이 자연스럽게 처리됨
  dragOffset.value = 0;
  dragState.value.isDragging = false;
  resumeAuto();

  // 클릭 이벤트 처리 후 hasMoved 리셋
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
onMounted(fetchTopPosts);
onBeforeUnmount(() => {
  stopAuto();
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
  overflow: hidden;
  user-select: none;
}

.carousel-track-outer {
  width: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  will-change: transform;
  cursor: grab;
  /* touch-action: none — 수평/수직 모두 JS가 직접 제어 */
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
}

.carousel-card {
  flex: 0 0 100%;
  background: #01523e;
  border: 1px solid #00ffc2;
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

  &.green {
    background: #01523e;
    border-color: #00ffc2;
  }

  img {
    -webkit-user-drag: none;
    pointer-events: none;
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
  border: 1px solid #00ffc2;
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #00ffc2;
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
  border-top: 1px solid #00ffc2;
  padding-top: 8px;
  margin-top: 4px;
}

.card-nickname {
  font-size: 11px;
  font-weight: 600;
  color: #00ffc2;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-date {
  font-size: 11px;
  color: #00ffc2;
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
  color: #00ffc2;
  display: flex;
  align-items: center;
  gap: 3px;
}

/* 닷 인디케이터 */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 8px;
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