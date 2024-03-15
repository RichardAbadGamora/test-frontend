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

      <p class="text-center text-app-sm mb-4">{{ $t('Members') }}</p>

      <div class="px-4 py-2">
        <input type="text" v-model="searchText" placeholder="Search members"
          class="app__input w-full rounded-md text-app-sm" />
      </div>
      <ul>
        <li v-for="(member, key) in filteredMembers" :key="key" @click="toggleSelection(member)"
          class="px-4 pb-1 cursor-pointer text-app-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between">
          <div class="flex items-center">
            <TrelloMemberAvatar :hxw="8" :png-size="60" :member="member" />
            <span class="ml-2">{{ (member as any).fullName }}</span>
          </div>
          <CheckIcon class="h-4 w-5 text-gray-500" v-if="isSelected(member)" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router';
import { XMarkIcon, CheckIcon } from '@heroicons/vue/24/outline'
import useTrelloStore from "@/stores/trello";
import useTrelloCard from "@/composables/trello/useTrelloCard"
import TrelloMemberAvatar from "@/components/Integrations/Trello/TrelloMemberAvatar.vue"

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

const { addMember, deleteMember } = useTrelloCard()
const trelloStore = useTrelloStore()
const menuOpen = ref(false);
const searchText = ref('');
const selectedMembers = ref(props.card.idMembers);

const boardMembers = trelloStore.organizationMembers;
const route = useRoute()
const pathHash = ref(route.params.pathHash.toString())

const filteredMembers = computed(() => {
  if (searchText.value === '') {
    return boardMembers;
  }
  const searchTerm = searchText.value.toLowerCase();
  return boardMembers.filter((member: any) => member.fullName.toLowerCase().includes(searchTerm));
});

const isSelected = (member: any) => {
  return selectedMembers.value.includes(member.id);
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const toggleSelection = async (member: any) => {
  const index = selectedMembers.value.indexOf(member.id);
  if (index === -1) {
    selectedMembers.value.push(member.id);
    await addMember(props.card.id, { value: member.id }, pathHash.value)
  } else {
    selectedMembers.value.splice(index, 1);
    await deleteMember(props.card.id, member.id, pathHash.value)
  }
};

defineExpose({
  toggleMenu,
  menuOpen
})

</script>
