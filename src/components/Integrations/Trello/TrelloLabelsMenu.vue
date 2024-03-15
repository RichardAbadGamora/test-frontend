<template>
  <div>
    <div v-if="menuOpen" @click="toggleMenu" class="fixed h-full w-full z-10"></div>
    <div v-if="menuOpen"
      class="absolute right-100 border border-gray-200 py-2 w-72 bg-white rounded-lg shadow-xl z-20 overflow-y-auto"
      x-transition:enter="transition ease-out duration-100" x-transition:enter-start="opacity-0 transform scale-95"
      x-transition:enter-end="opacity-100 transform scale-100" x-transition:leave="transition ease-in duration-75"
      x-transition:leave-start="opacity-100 transform scale-100" x-transition:leave-end="opacity-0 transform scale-95">
      <button @click="toggleMenu" class="absolute top-0 right-0 mt-1 mr-2 text-gray-500 hover:text-gray-700">
        <XMarkIcon class="h-5 w-5" />
      </button>
      <p class="text-center text-app-sm mb-4">{{ $t('Labels') }}</p>
      <!-- Search Input for Board Labels -->
      <div class="px-4 py-2">
        <input type="text" v-model="searchText" placeholder="Search labels"
          class="app__input w-full rounded-md text-app-sm" />
      </div>
      <ul>
        <li v-for="label in filteredLabels" :key="label.id" @click="toggleSelection(label)"
          class="px-4 pb-1 cursor-pointer w-full text-app-sm text-gray-700 hover:bg-gray-100">
          <div class="flex items-center">
            <input type="checkbox" class="mr-2" v-model="selectedLabels" :value="label.id" />
            <button type="button" class="text-gray w-full px-4 py-1 text-app-sm rounded-sm"
              :style="{ backgroundColor: Colors(label.color) || '#ccc', minHeight: '2.5rem', minWidth: '6rem' }">
              {{ label.name }}
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, type Ref, computed } from 'vue'
import { useRoute } from 'vue-router';
import { XMarkIcon } from '@heroicons/vue/24/outline'
import useTrelloStore from "@/stores/trello";
import useTrelloCard from "@/composables/trello/useTrelloCard"
import { Colors } from "@/helpers/trello-colors";
const props = defineProps({
  card: {
    type: Object,
    default: null,
  },
  position: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:labels'])

const { createIdLabels, deleteIdLabels } = useTrelloCard()
const route = useRoute()
const trelloStore = useTrelloStore()
const menuOpen = ref(false);
const searchText = ref('');
const selectedLabels = ref(props.card.labels.map((label: { id: number }) => label.id));

const pathHash = ref(route.params.pathHash.toString())
const boardLabels = trelloStore.boardLabels;

const filteredLabels: Ref<any[]> = computed(() => {
  if (searchText.value === '') {
    return boardLabels;
  }
  const searchTerm = searchText.value.toLowerCase();
  return boardLabels.filter(label => (label as { name: string }).name.toLowerCase().includes(searchTerm));
});

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const toggleSelection = async (label: any) => {
  const index = selectedLabels.value.indexOf(label.id);
  if (index === -1) {
    selectedLabels.value.push(label.id);
    await createIdLabels(props.card.id, { value: label.id }, pathHash.value)
  } else {
    selectedLabels.value.splice(index, 1);
    await deleteIdLabels(props.card.id, label.id, pathHash.value)
  }
  emit('update:labels');
};

defineExpose({
  toggleMenu,
  menuOpen
})

</script>
