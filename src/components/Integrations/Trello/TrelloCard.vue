<template>
  <div>
    <div class="bg-white rounded-lg p-2 card" parent-index="index" item-key="hash" @click="openTrelloCard">
      <div class="flex flex-wrap items-center mb-2" v-if="card.labels.length > 0">
        <div class="flex items-center">
          <div class="flex items-center">
            <div class="flex flex-wrap gap-1">
              <button v-for="label in card.labels" :key="label.id" class="w-10 h-2 rounded-md"
                :style="{ backgroundColor: Colors(label.color) || '#ccc' }"></button>
            </div>
          </div>
        </div>
      </div>
      <p class="text-app-sm">{{ card.name }}</p>
      <div class="mt-2">
        <div class="flex items-center">
          <div class="flex items-center">
            <EyeIcon class="h-4 mr-3" v-if="card.badges.subscribed" />

            <Bars3BottomLeftIcon class="h-4 mr-3" v-if="card.badges.description" />

            <PaperClipIcon class="h-4 mr-3" v-if="card.badges.attachments > 0" />
          </div>

          <div v-if="card.idMembers.length <= 6" class="ml-auto">
            <div class="flex flex-center">
              <template v-for="member in card.idMembers" :key="member">
                <TrelloMemberAvatar :member="trelloStore.getMemberById(member)" />
              </template>
            </div>
          </div>
        </div>

        <template v-if="card.idMembers.length > 6">
          <div class="flex flex-wrap justify-end mt-2">
            <template v-for="member in card.idMembers" :key="member">
              <TrelloMemberAvatar :member="trelloStore.getMemberById(member)" />
            </template>
          </div>
        </template>
      </div>
    </div>
    <Teleport to="body">
      <TrelloCardModal v-if="showTrelloCardModal" :card="card" :list="list" @close="showTrelloCardModal = false"
        @cardUpdated="$emit('cardUpdated', list.id)" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Bars3BottomLeftIcon, EyeIcon, PaperClipIcon } from '@heroicons/vue/24/outline'
import { Colors } from "@/helpers/trello-colors";
import TrelloCardModal from '@/components/Integrations/Trello/TrelloCardModal.vue';
import TrelloMemberAvatar from "@/components/Integrations/Trello/TrelloMemberAvatar.vue"
import useTrelloStore from '@/stores/trello';

defineProps({
  card: {
    type: Object,
    default: null,
  },
  list: {
    type: Object,
    default: null,
  }
})

const trelloStore = useTrelloStore();

const showTrelloCardModal = ref<boolean>(false)

const openTrelloCard = () => {
  showTrelloCardModal.value = true;
}
</script>

<style>
.card {
  cursor: grabbing;
  margin-bottom: 8px;
}
</style>
