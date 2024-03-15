<template>
  <div :style="boardStyle(board)" class="h-full flex items-start overflow-x-auto min-h-[600px]">
    <div class="flex p-4 space-x-4">
      <div v-if="listFetched">
        <draggable :list="lists" item-key="hash" :id="board.id" class="flex items-start space-x-4" @change="changeList">
          <template #item="{ element: list }">
            <TrelloList :key="list.id" :id="list.id" item-key="hash" :list="list" @addCardToList="addCardToList"
              @updateCards="updateCards" :targetListId="targetListId" @saveDragTargetList="saveDragTargetList"
              @updateListName="updateListName" @archiveList="archiveList" />
          </template>
        </draggable>
      </div>

      <div v-if="showAddListInput" class="w-64">
        <div class=" bg-gray-200 rounded-lg p-2 shadow-md">
          <input v-model="newListName" placeholder="Enter list title.." @keydown.enter="createList" @blur="createList"
            class="app__input mb-2 p-2" />
          <div class="flex space-x-2">
            <button @click="createList" :disabled="loading" class="btn--primary">
              <AppLoader v-if="loading" size="14" /> <span class="text-left">{{ $t('trello:add-list') }}</span>
            </button>
            <button @click="showAddListInput = false" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md">
              <XMarkIcon class="h-4 mr-1" />
            </button>
          </div>
        </div>
      </div>
      <button v-if="!showAddListInput" @click="showAddListInput = true"
        class="w-64 h-12 text-app-sm flex items-center bg-gray-200 rounded-lg p-2 shadow-md hover:bg-gray-300">
        <PlusIcon class="h-4 mr-1" /> {{ $t('trello:add-another-list') }}
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router';
import draggable from 'vuedraggable'
import AppLoader from '@/components/App/AppLoader.vue'
import TrelloService from '@/services/TrelloService';
import TrelloList from '@/components/Integrations/Trello/TrelloList.vue'
import useAsync from '@/composables/useAsync';
import useTrelloStore from '@/stores/trello';

const props = defineProps({
  board: {
    type: Object,
    default: null,
  }
})
const route = useRoute()
const lists: Ref<any> = ref([])
const newListName = ref('')
const showAddListInput = ref(false)
const loading = ref(false)
const listFetched = ref(false)
const boardCards = ref([])
const boardCardsLoaded = ref(false)
const targetListId = ref('')
const trelloStore = useTrelloStore();
const pathHash = ref(route.params.pathHash.toString())

onMounted(async () => {
  getLists()
  trelloStore.setOrganizationMembers(props.board.idOrganization, pathHash.value)
  trelloStore.setBoardLabels(props.board.id, pathHash.value)
})

const getLists = async () => {
  const { response } = await useAsync(TrelloService.boards.getLists(props.board.id, pathHash.value));
  await getBoardCards()
  const newLists = response.data.map((list: any) => {
    list.cards = boardCards.value.filter((card: any) => card.idList === list.id)
    return list;
  })

  lists.value = [...newLists]

  listFetched.value = true
}

const getBoardCards = async () => {
  const { response } = await useAsync(TrelloService.boards.getCards(props.board.id, pathHash.value));
  boardCards.value = response.data;
  boardCardsLoaded.value = true
}

const boardStyle = (board: any) => {
  return {
    backgroundColor: board?.prefs?.backgroundColor,
    backgroundImage: `url(${board?.prefs?.backgroundImage})`,
    backgroundSize: 'cover'
  };
}

const saveDragTargetList = (id: string) => {
  targetListId.value = id
}

const createList = async () => {
  if (newListName.value.trim() !== '') {
    loading.value = true;
    await useAsync(TrelloService.lists.createList({ name: newListName.value, idBoard: props.board.id, pos: 'bottom' }, pathHash.value));
    newListName.value = '';
    loading.value = false;
    showAddListInput.value = false;
    getLists();
  }
}

const changeList = async (event: any) => {
  const { moved } = event

  let payload = {
    idBoard: props.board.id
  }

  let newIndex = moved.newIndex

  // Get the current list at the target index
  const currentList = lists.value[newIndex];
  // Get the previous list if it exists
  const previousList = newIndex > 0 ? lists.value[newIndex - 1] : lists.value[0];
  // Get the next list if it exists
  const nextList = newIndex > 0 ? lists.value[newIndex + 1] : lists.value[0];

  currentList.pos = previousList.pos + 1;
  if (nextList) {
    nextList.pos = currentList.pos + 1;
  } else {
    // moving to the bottom
    currentList.pos = "bottom";
  }

  // moving from bottom to top
  if (currentList && previousList && nextList && currentList.name === previousList.name && currentList.name === nextList.name) {
    currentList.pos = 'top';
  }

  lists.value = [...lists.value];


  await useAsync(TrelloService.lists.updateList(currentList.id, { pos: currentList.pos, ...payload }, pathHash.value))
  if (nextList) {
    await useAsync(TrelloService.lists.updateList(nextList.id, { pos: nextList.pos, ...payload }, pathHash.value))
  }

}

const addCardToList = (list: any, data: any, pos: string) => {
  if (pos === 'bottom') {
    list.cards.push(data)
  } else {
    list.cards.unshift(data)
  }
}

const updateCards = (list: any, cards: any) => {
  list.cards = cards
}

const updateListName = (list: any, newName: string) => {
  list.name = newName
}

const archiveList = async (id: string) => {
  const newLists = lists.value.filter((list: any) => list.id != id)
  lists.value = [...newLists]
}

</script>
