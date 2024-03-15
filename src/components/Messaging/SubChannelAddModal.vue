<template>
  <AppModal max-width="max-w-xl" @close="close()">
    <div class="p-4 grid place-content-center h-full" v-if="loading">
      <AppLoader />
    </div>
    <template v-else>
      <div>
        <h3
          class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50"
          id="modal-title"
        >
          {{ folder?.hash ? $t('Edit') : $t('Add new') }} {{ $t('Sub Channel') }}
        </h3>
        <div>
          <form class="space-y-6 my-8" novalidate @submit.prevent="handleSubmit">
            <div>
              <label for="name" class="app__form-label">{{ $t('Name') }}</label>
              <div class="mt-2">
                <input
                  v-model="form.name"
                  type="text"
                  class="app__input"
                  placeholder="Enter Sub Channel name..."
                />
                <small class="app__input-error" v-if="errors.name">{{ errors.name[0] }}</small>
              </div>
              <p class="mt-4 text-app-sm dark:text-white">Select members:</p>
              <div class="space-y-4 flex flex-col mt-4 overflow-auto h-60">
                <div
                  v-for="member in members"
                  :key="member.user_id"
                  @click="handleSelectMember(member)"
                  class="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 pl-0 cursor-pointer flex items-center text-app-sm dark:text-white border rounded-md border-gray-200 dark:border-gray-500"
                >
                  <div class="p-4">
                    <input type="checkbox" v-model="member.selected" class="rounded" />
                  </div>
                  <p class="select-none">{{ member?.user?.name }}</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <button :disabled="saving" type="button" class="btn--light" @click="close()">
          {{ $t('Cancel') }}
        </button>
        <button :disabled="saving" type="submit" class="btn--primary" @click="handleSubmit">
          <AppLoader v-if="saving" />
          <span class="text-left">
            {{ $t('Save') }}
          </span>
        </button>
      </div>
    </template>
  </AppModal>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeMount, onMounted, ref, type Ref } from 'vue'
import AppLoader from '@/components/App/AppLoader.vue'
import AppModal from '@/components/App/AppModal.vue'
import useChatStore from '@/stores/chat'
import useSubChannel from '@/composables/useSubChannel'
import useAsync from '@/composables/useAsync'
import useError from '@/composables/useError';

const chatStore = useChatStore()
const subChannel = useSubChannel()
const toggleAddEditModal = inject('toggleAddEditSubChannelModal') as Function
const { formatErrors } = useError()

const emit = defineEmits(['close', 'success'])

const props = defineProps({
  folder: {
    type: Object,
    default: null
  },
  parent: {
    type: Object,
    default: null
  },
  pageHash: {
    type: String,
    default: null
  }
})

const defaultForm = {
  name: ''
}

const errors: Ref<any> = ref({})
const form: Ref<any> = ref({ ...defaultForm })
const loading: Ref<boolean> = ref(false)
const saving : Ref<boolean> = ref(false)
const members: Ref<any> = ref([])
const selectedMembers = computed(() => members.value.filter((member: any) => member.selected))

onBeforeMount(() => {
  if (props.folder) {
    form.value = { ...props.folder }
  }
})

onMounted(() => {
  fetchMembers()
})

const fetchMembers = async () => {
  if (!props.parent) return

  loading.value = true

  const response = await chatStore.getMembers()
  members.value = response.members

  loading.value = false
}

const close = () => {
  toggleAddEditModal(false, null)
}

const handleSelectMember = (member: any) => {
  member.selected = !member.selected
}

const handleSubmit = async () => {
  saving.value = true

  const payload = {
    ...form.value,
    channel_hash: props.parent.hash,
    path_hash: props.parent.path_hash,
  }

  const { error, response } = await useAsync(subChannel.create(payload))

  if (error) {
    errors.value = formatErrors(error)

    return saving.value = false
  }

  const subChannelBeybe = await chatStore.getStreamChannel(<any>response?.data.data)
  subChannelBeybe.addMembers(
    selectedMembers.value.map((member: any) => member.user_id)
  )

  close()
  emit('success', response?.data?.data)
}
</script>
