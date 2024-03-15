<template>
  <AppModal max-width="max-w-3xl min-h-screen h-90vh" @close="$emit('close')">
    <div class="flex flex-row gap-4">
      <div class="basis-3/4">
        <div class="flex items-center">
          <h3 class="text-app-base font-semibold leading-6 text-typo-900 inline-flex" id="modal-title">
            <WindowIcon class="h-6 mr-2" />
            <span v-if="!editingCardName" @click="startEditCardName">{{ form.name }}</span>
          </h3>
          <input v-if="editingCardName" v-model="form.name" class="app__input w-full rounded-md text-app-sm pl-2"
            @keydown.enter="saveCardName" />
          <AppLoader v-if="cardNameUpdating" class="ml-2" />
        </div>
        <p class="text-app-sm card-content">
          in list <a href="" class="underline">{{ list.name }}</a>
        </p>
        <div class="bg-white py-8 rounded-md">
          <div class="flex flex-wrap gap-4 card-content">

            <div>
              <p class="pb-1 text-app-xs font-semibold text-gray-600">Members</p>
              <div class="flex flex-wrap justify-start mt-2">
                <template v-for="(member, index) in card.idMembers" :key="index">
                  <TrelloMemberAvatar :hxw="8" :png-size="60" :member="trelloStore.getMemberById(member)" />
                </template>
                <TrelloPlus :round="true" @trigger="toggleMembersMenu" :hxw="8" />
              </div>
            </div>

            <div>
              <p class="pb-1 text-app-xs font-semibold text-gray-600">{{ $t('Labels') }}</p>
              <div class="flex flex-wrap justify-start mt-2">
                <template v-if="card.labels.length > 0">
                  <div class="flex items-center">
                    <div class="flex flex-wrap gap-1">
                      <button v-for="label in card.labels" :key="label.id" type="button"
                        class="text-gray  px-4 py-1 text-app-sm rounded-sm"
                        :style="{ backgroundColor: Colors(label.color) || '#ccc', minHeight: '2rem', minWidth: '3rem' }">
                        {{ label.name }}
                      </button>
                    </div>
                  </div>
                </template>
                <TrelloPlus @trigger="toggleLabelsMenu" :hxw="8" class="ml-1" />
              </div>
            </div>

            <div class="hidden">
              <p class="pb-1 text-app-xs font-semibold text-gray-600">{{ $t('Notifications') }}</p>
              <div class="flex flex-wrap justify-start mt-2">

              </div>
            </div>

            <div class="hidden">
              <p class="pb-1 text-app-xs font-semibold text-gray-600">{{ $t('Story Points') }}</p>
              <div class="flex flex-wrap justify-start mt-2">

              </div>
            </div>
          </div>

          <div class="my-4">
            <div v-if="editingDescription">
              <form class="mb-8" novalidate @submit.prevent>
                <label for="name" class="app__form-label-icon">
                  <Bars3BottomLeftIcon class="h-6 mr-3" /> {{ $t('Description') }}
                </label>
                <div class="mt-2 card-content">
                  <textarea v-model="form.description" class="app__input w-full rounded-md text-app-sm"
                    rows="6"></textarea>
                </div>

                <div class="flex space-x-2 mt-4 card-content">
                  <button @click="saveDescription" class="btn--primary">{{ $t('Save') }}</button>
                  <button @click="cancelEdit" class="btn--light">{{ $t('Cancel') }}</button>
                </div>
              </form>
            </div>

            <div v-else>
              <div class="flex">
                <p class="app__form-label-icon mb-2 w-auto">
                  <Bars3BottomLeftIcon class="h-6 mr-3" />{{ $t('Description') }}
                </p>
                <div class="flex-grow text-right" v-if="form.description">
                  <button @click="startEdit" class="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-sm text-app-sm">
                    {{ $t('Edit') }}
                  </button>
                </div>
                <div class="flex-grow" v-else></div>
              </div>
              <div class="text-gray-600 mb-4 text-app-sm break-words whitespace-pre-line card-content">
                <p>{{ form.description }}</p>
                <div v-if="!form.description" class="bg-gray-100 hover:bg-gray-200 rounded-sm py-2 px-4 cursor-pointer"
                  @click="startEdit">
                  {{ $t('trello:card-desc-placeholder') }}
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <p class="app__form-label-icon mb-2">
              <ListBulletIcon class="h-6 mr-3" />{{ $t('Activity') }}
            </p>
          </div>
        </div>
      </div>
      <div class="basis-1/4" style="margin-top: 5rem;">
        <p class="pb-1 text-app-xs font-semibold text-gray-600">{{ $t('Add to card') }}</p>
        <div class="flex flex-col items-end space-y-2 mb-2">
          <button @click="toggleMembersMenu"
            class="flex items-start bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-sm text-app-sm w-full text-left">
            <UserIcon class="h-4 mr-3" />
            <span>{{ $t('Members') }}</span>
          </button>
        </div>

        <TrelloMembersMenu ref="membersMenuElement" :card="card" :position="position" />

        <div class="flex flex-col items-end space-y-2 mb-2">
          <button @click="toggleLabelsMenu"
            class="flex items-start bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-sm text-app-sm w-full text-left">
            <TagIcon class="h-4 mr-3" />
            <span>{{ $t('Labels') }}</span>
          </button>
        </div>

        <TrelloLabelsMenu ref="labelsMenuElement" :card="card" :position="position" @update:labels="updateCardLabels" />

        <div class="flex flex-col items-end space-y-2 mb-2 hidden">
          <button @click="addDates"
            class="flex items-start bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-sm text-app-sm w-full text-left">
            <ClockIcon class="h-4 mr-3" />
            <span>{{ $t('Dates') }}</span>
          </button>
        </div>

        <div class="flex flex-col items-end space-y-2 mb-2 hidden">
          <button @click="addAttachments"
            class="flex items-start bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-sm text-app-sm w-full text-left">
            <PaperClipIcon class="h-4 mr-3" />
            <span>{{ $t('Attachments') }}</span>
          </button>
        </div>

        <p class="pb-1 pt-1 text-app-xs font-semibold text-gray-600">{{ $t('Actions') }}</p>
        <div class="flex flex-col items-end space-y-2 mb-2">
          <button
            class="flex items-start bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-sm text-app-sm w-full text-left"
            @click="archiveCard">
            <ArchiveBoxXMarkIcon class="h-4 mr-3" />
            <span>{{ $t('Archive') }}</span>
          </button>
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import {
  Bars3BottomLeftIcon,
  ListBulletIcon,
  WindowIcon,
  UserIcon,
  TagIcon,
  ClockIcon,
  PaperClipIcon,
  ArchiveBoxXMarkIcon
} from '@heroicons/vue/24/outline'
import { Colors } from '@/helpers/trello-colors'
import { useRoute } from 'vue-router';
import AppModal from '@/components/App/AppModal.vue'
import AppLoader from '@/components/App/AppLoader.vue'
import TrelloMembersMenu from '@/components/Integrations/Trello/TrelloMembersMenu.vue'
import TrelloMemberAvatar from "@/components/Integrations/Trello/TrelloMemberAvatar.vue"
import TrelloLabelsMenu from '@/components/Integrations/Trello/TrelloLabelsMenu.vue'
import useTrelloStore from '@/stores/trello';
import TrelloPlus from '@/components/Integrations/Trello/TrelloPlus.vue'
import useTrelloCard from '@/composables/trello/useTrelloCard'

const props = defineProps({
  card: {
    type: Object,
    default: null
  },
  list: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success', 'cardUpdated'])
const route = useRoute()

const form: Ref<any> = ref({})
const cardNameUpdating: Ref<boolean> = ref(false)
const membersMenuElement: Ref<any> = ref(null)
const labelsMenuElement: Ref<any> = ref(null)
const position = ref(0)
const editingDescription: Ref<boolean> = ref(false)
const editingCardName: Ref<boolean> = ref(false)
const editedDescription = ref(form.value.description)
const pathHash = ref(route.params.pathHash.toString())

const trelloStore = useTrelloStore();
const { updateCard } = useTrelloCard()

onMounted(() => {
  form.value = {
    id: props.card.id,
    name: props.card.name,
    description: props.card.desc
  }
})

const startEditCardName = () => {
  editingCardName.value = true
}

const saveCardName = async () => {
  cardNameUpdating.value = true
  await updateCard(form.value.id, { name: form.value.name }, pathHash.value)
  editingCardName.value = false
  cardNameUpdating.value = false

  emit('cardUpdated', props.card.idList)
}

const startEdit = () => {
  editingDescription.value = true
}

const toggleMembersMenu = () => {
  if (labelsMenuElement.value.menuOpen) {
    labelsMenuElement.value.toggleMenu()
  }
  membersMenuElement.value.toggleMenu()
}

const toggleLabelsMenu = () => {
  if (membersMenuElement.value.menuOpen) {
    membersMenuElement.value.toggleMenu()
  }
  labelsMenuElement.value.toggleMenu()
}

const addDates = () => {
  //
}

const addAttachments = () => {
  //
}

const cancelEdit = () => {
  editingDescription.value = false
  editedDescription.value = form.value.description
}
const archiveCard = async () => {
  await updateCard(form.value.id, { closed: true }, pathHash.value)
  emit('cardUpdated', props.card.idList)
  emit('close')
}

const saveDescription = async () => {
  await updateCard(form.value.id, { desc: form.value.description }, pathHash.value)
  editingDescription.value = false

  emit('cardUpdated', props.card.idList)
}

const updateCardLabels = () => {
  emit('cardUpdated', props.card.idList)
}
</script>

<style>
.card-content {
  margin-left: 2rem;
}
</style>
