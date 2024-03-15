<template>
  <div>
    <template v-if="!isObjectEmptyOrNull(activeBoard)">
      <div>
        <header class="bg-gray-700 p-4">
          <div class="container flex items-center">
            <div class="text-white text-app-md font-semibold pr-2">{{ activeBoard.name }}</div>
            <nav>
              <ul class="flex space-x-4 pl-4">
                <li>
                  <button class="bg-white text-gray-500 px-3 py-1.5 rounded-md hover:bg-gray-200 text-app-sm"
                    @click="goToBoards">{{ $t('Boards') }}</button>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <TrelloBoard :board="activeBoard" />
      </div>
    </template>

    <div class="grid gap-4" :class="boardLayout" v-else>
      <button type="button" class="btn btn--light button-board" :disabled="loading" @click="createBoard">{{
        $t('trello:create-new-board') }}</button>
      <div v-for="(board, index) in boards" :key="index" class="board" @click="goToBoard(board)"
        :style="boardStyle(board)">
        <div class="board-title text-white">{{ (board as any).name }}</div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue'
import { useRoute } from 'vue-router';
import useAsync from '@/composables/useAsync'
import TrelloBoard from '@/components/Integrations/Trello/TrelloBoard.vue';
import TrelloService from '@/services/TrelloService';

const props = defineProps({
  page: {
    type: Object,
    default: null,
  },
  tokenMember: {
    type: Object,
    default: null,
  }
})

const boardLayout = computed(() => {
  if ([3, 4].includes(props.page.w)) {
    return 'grid-cols-4';
  } else if ([2].includes(props.page.w)) {
    return 'grid-cols-2';
  }
  return 'grid-cols-1';
});

const route = useRoute()
const loading = ref(false)
const activeBoard: Ref<any> = ref({})
const showBoards = ref<boolean>(true)
const boards = ref([])
const pathHash = ref(route.params.pathHash.toString())

onMounted(async () => {
  getMemberBoards()
})

const getMemberBoards = async () => {
  const { response } = await useAsync(TrelloService.members.getMemberBoards(props.tokenMember.meta.username, pathHash.value));

  boards.value = response.data;
}

const goToBoard = (board: object) => {
  showBoards.value = false
  activeBoard.value = board
}

const goToBoards = () => {
  showBoards.value = true
  activeBoard.value = null
}

const createBoard = async () => {
  loading.value = true
  await useAsync(TrelloService.boards.createBoard({ name: 'Untitled Board' }, pathHash.value));
  loading.value = false
  getMemberBoards()
}

const boardStyle = (board: any) => {
  return {
    backgroundColor: board?.prefs?.backgroundColor,
    backgroundImage: `url(${board?.prefs?.backgroundImage})`,
    backgroundSize: 'cover'
  };
}

const isObjectEmptyOrNull = (obj: Record<string, any> | null): boolean => {
  return obj === null || Object.keys(obj).length === 0;
};

</script>

<style scoped>
.board {
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

.board-title {
  position: absolute;
  top: 10px;
  left: 10px;
}

.board-number {
  position: absolute;
  top: 25px;
  left: 10px;
  font-size: 12px;
  color: #666;
}
</style>
