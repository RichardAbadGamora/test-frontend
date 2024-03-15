<template>
  <div class="w-64 bg-gray-200 rounded-lg p-2 h-auto">
    <div class="flex items-center">
      <div class="text-app-sm font-semibold mb-2">
        <div class="flex items-center">
          <div class="w-full p-2" v-if="!editingListName" @click="editLastNameClick">{{ list.name }}</div>
          <input v-else v-model="listName" @keydown.enter="changeListName" class="p-2 app__input" />
          <AppLoader v-if="listNameUpdating" class="ml-2" />
        </div>
      </div>

      <div class="flex-grow text-right">
        <div class="relative inline-block text-left">
          <button type="button" @click="toggleMenu" class="hover:bg-gray-300 rounded-sm py-1 px-1">
            <EllipsisHorizontalIcon class="h-6 mr-1" />
          </button>
          <div v-if="menuOpen" @click="toggleMenu" class="fixed inset-0 h-full w-full z-10"></div>
          <div v-if="menuOpen" class="absolute right-0 mt-2 py-2 w-60 bg-white rounded-lg shadow-xl z-20"
            x-transition:enter="transition ease-out duration-100" x-transition:enter-start="opacity-0 transform scale-95"
            x-transition:enter-end="opacity-100 transform scale-100" x-transition:leave="transition ease-in duration-75"
            x-transition:leave-start="opacity-100 transform scale-100"
            x-transition:leave-end="opacity-0 transform scale-95">
            <button @click="toggleMenu" class="absolute top-0 right-0 mt-1 mr-2 text-gray-500 hover:text-gray-700">
              <XMarkIcon class="h-5 w-5" />
            </button>
            <p class="text-center text-app-sm mb-4">{{ $t('trello:list-actions') }}</p>
            <a href="javascript:void(0)" @click="toggleMenu(); cardInput.state = true; cardInput.pos = 'top'"
              class="text-app-sm block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{{ $t('trello:add-a-card')
              }}...</a>
            <hr>
            <a href="javascript:void(0)"
              @click="archiveBoardList"
              class="text-app-sm block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{{
                $t('trello:archive-this-list') }}</a>
          </div>
        </div>
      </div>
    </div>

    <div class="list-container">
      <div v-if="cardInput.state && cardInput.pos === 'top'" class="my-2">
        <textarea v-model="newCardName" :placeholder="$t('trello:modal:input:new-card:placeholder')"
          class="w-full app__input p-2 mb-2" rows="3"></textarea>
        <div class="flex space-x-2">
          <button @click="createCard('top')" :disabled="loading" class="btn--primary">
            <AppLoader v-if="loading" size="14" /> <span class="text-left">{{ $t('trello:add-card') }}</span>
          </button>
          <button @click="cardInput.state = false" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md">
            <XMarkIcon class="h-4 mr-1" />
          </button>
        </div>
      </div>

      <draggable :list="list.cards" item-key="hash" group="lists" class="list" :id="list.id" @change="cardChanged"
        :move="moveCard">
        <template #item="{ element: card, index }">
          <TrelloCard :key="index" :list="list" :data-card-pos="card.pos" :data-card="card.name" :card="card"
            @cardUpdated="cardUpdated" />
        </template>
      </draggable>

      <button v-if="!cardInput.state" @click="cardInput.state = true; cardInput.pos = 'bottom'"
        class="w-full flex items-center text-app-sm text-gray-500 hover:text-gray-700 mt-3 mb-2">
        <PlusIcon class="h-4 mr-1" /> {{ $t('trello:add-a-card') }}
      </button>

      <div v-if="cardInput.state && cardInput.pos === 'bottom'" class="mt-2">
        <textarea v-model="newCardName" :placeholder="$t('trello:modal:input:new-card:placeholder')"
          class="w-full app__input p-2 mb-2" rows="3"></textarea>
        <div class="flex space-x-2">
          <button @click="createCard('bottom');" :disabled="loading" class="btn--primary">
            <AppLoader v-if="loading" size="14" /> <span class="text-left">{{ $t('trello:add-card') }}</span>
          </button>
          <button @click="cardInput.state = false" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md">
            <XMarkIcon class="h-4 mr-1" />
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PlusIcon, XMarkIcon, EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router';
import draggable from 'vuedraggable'
import AppLoader from '@/components/App/AppLoader.vue'
import TrelloService from '@/services/TrelloService';
import TrelloCard from '@/components/Integrations/Trello/TrelloCard.vue'
import useAsync from '@/composables/useAsync';
import useTrelloCard from '@/composables/trello/useTrelloCard';
import useTrelloList from '@/composables/trello/useTrelloList';

const props = defineProps({
  list: {
    type: Object,
    default: null,
  },
  targetListId: {
    type: String
  }
})

const emit = defineEmits(['saveDragTargetList', 'archiveList', 'addCardToList', 'updateCards', 'updateListName'])

const loading = ref(false)
const listNameUpdating = ref(false)
const editingListName = ref(false);
const newCardName = ref('')
const menuOpen = ref(false);
const listClone = ref({})
const cardInput = ref({
  state: false,
  pos: 'bottom'
})
const listName = ref('')

const { getCards } = useTrelloList()
const { closeList } = useTrelloList()
const { updateCard } = useTrelloCard()
const route = useRoute()
const pathHash = ref(route.params.pathHash.toString())

onMounted(async () => {
  listClone.value = props.list
})

const editLastNameClick = () => {
  editingListName.value = true
  listName.value = props.list.name
}
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const changeListName = async () => {
  if (listName.value.trim() !== '') {
    listNameUpdating.value = true;
    await useAsync(TrelloService.lists.updateList(props.list.id, { name: listName.value }, pathHash.value));
    listNameUpdating.value = false;
    editingListName.value = false;
  } else {
    editingListName.value = false;
  }
  emit('updateListName', props.list, listName.value)
}

const cardUpdated = async (id: string) => {
  const cards = await getCards(id, pathHash.value);
  emit('updateCards', props.list, cards)
}

const createCard = async (pos: string) => {
  if (newCardName.value.trim() !== '') {
    loading.value = true
    const { response } = await useAsync(TrelloService.cards.createCard({ name: newCardName.value, idList: props.list.id, pos }, pathHash.value));
    newCardName.value = ''
    loading.value = false

    if (pos === 'bottom') {
      emit('addCardToList', props.list, response.data, 'bottom');
    } else {
      emit('addCardToList', props.list, response.data, 'top');
    }
  }
}

const cardChanged = async (event: any) => {
  const { added, moved, removed } = event

  if (removed) {
    return false
  }

  let payload = {
    idList: props.targetListId
  }

  let newIndex = null
  if (added) {
    newIndex = added.newIndex
  } else if (moved) {
    newIndex = moved.newIndex
  }

  // Get the current card at the target index
  const currentCard = props.list.cards[newIndex];
  // Get the previous card if it exists
  const previousCard = newIndex > 0 ? props.list.cards[newIndex - 1] : props.list.cards[0];
  // Get the next card if it exists
  const nextCard = newIndex > 0 ? props.list.cards[newIndex + 1] : props.list.cards[0];

  currentCard.pos = previousCard.pos + 1;
  if (nextCard) {
    nextCard.pos = currentCard.pos + 1;
  } else {
    // moving to the bottom
    currentCard.pos = 'bottom';
  }

  // moving from bottom to top
  if (currentCard && previousCard && nextCard && currentCard.name === previousCard.name && currentCard.name === nextCard.name) {
    currentCard.pos = 'top';
  }

  await updateCard(currentCard.id, { pos: currentCard.pos, ...payload }, pathHash.value);

  if (nextCard) {
    await updateCard(nextCard.id, { pos: nextCard.pos, ...payload }, pathHash.value);
  }
}

const moveCard = (evt: any) => {
  emit('saveDragTargetList', evt.to.id)
}

const archiveBoardList = async () => {
  toggleMenu()
  emit('archiveList', props.list.id);
  await closeList(props.list.id, { value: true }, pathHash.value);

}

</script>