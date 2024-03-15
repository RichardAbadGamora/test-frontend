<template>
  <div>
    <div class="mb-4">
      <h4 class="setting-section__title">
        {{ $t('Invite Users') }}
      </h4>
      <p class="setting-section__description">{{ $t('path-invite:heading-help-text') }}</p>
    </div>
    <div class="!mt-0 space-y-6">
      <div>
        <template v-if="!selection">
          <label for="name" class="app__form-label !flex items-center gap-2">{{ $t('Search') }}
            <AppLoader size="14" v-if="searching" />
          </label>
          <div class="mt-2">
            <input v-model="searchInput" type="text" class="app__input" @input="handleSearch"
              :placeholder="$t('path-invite:placeholder')" />
          </div>
        </template>
        <div v-else class="px-4 py-2 mt-2 bg-white dark:bg-gray-800 text-app-sm border rounded flex justify-between items-center dark:text-typo-50">
          <span v-if="selectionType === SelectionType.HASH">
            {{ selection?.fullname }}
            <span class="text-typo-500 dark:text-typo-100 text-app-xs">({{ selection.email }})</span>
          </span>
          <template v-else>
            {{ selection.email }}
          </template>
          <XCircleIcon class="h-5 text-typo-500 cursor-pointer" v-tooltip.left="'Cancel'" @click="clearSelection" />
        </div>
        <small class="app__input-error" v-if="errors.email">{{ errors.email[0] }}</small>
        <small class="app__input-error" v-if="errors.user_id">{{ errors.user_id[0] }}</small>
        <ul v-if="searched && !searching"
          class="mt-2 bg-white text-app-sm border rounded max-h-[180px] overflow-y-auto shadow">
          <template v-if="!searching && !suggestions.length">
            <li v-if="isValidEmail(lastSearchInput)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-col dark:bg-gray-800"
              @click="handleSelect({ email: lastSearchInput }, SelectionType.EMAIL)">
              <span class="font-semibold dark:text-typo-50">{{ lastSearchInput }}</span>
              <small class="text-app-xs text-typo-500 dark:text-typo-100">
                {{ $t('path-invite:help-text') }}
              </small>
            </li>
            <li v-else class="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:bg-gray-800" @click="resetSearch">
              <small class="text-app-xs text-typo-500 dark:text-typo-100">
                {{ $t('path-invite:cant-find', { input: lastSearchInput }) }}
              </small>
            </li>
          </template>
          <li v-for="item in suggestions" :key="item.hash" class="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:bg-gray-800"
            @click="handleSelect(item, SelectionType.HASH)">
            <span>
              {{ item.fullname }}
              <span class="text-typo-500 dark:text-typo-100 text-app-xs">({{ item.email }})</span>
            </span>
          </li>
        </ul>
      </div>
      <button :disabled="!selection" class="btn btn--primary dark:!bg-gray-700" @click="sendInvitation">
        <AppLoader size="14" v-if="sending" />
        <span>
          {{ $t('Send invitation to join') }}
        </span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { XCircleIcon } from '@heroicons/vue/24/outline';
import { SelectionType } from '@/enums/Invitation';
import { filterify, isValidEmail } from '@/helpers/form'
import debounce from 'lodash.debounce'
import AppLoader from '@/components/App/AppLoader.vue';
import useAsync from '@/composables/useAsync';
import PathService from '@/services/PathService';
import UserService from '@/services/UserService'
import useError from '@/composables/useError';

const emit = defineEmits(['invite'])

const { formatErrors } = useError()
const route = useRoute()

const lastSearchInput = ref('')
const errors: Ref<any> = ref({})
const searched = ref(false)
const searchInput = ref('')
const searching = ref(false)
const selection: Ref<any> = ref(null)
const selectionType: Ref<SelectionType | null> = ref(null)
const sending = ref(false)
const suggestions: Ref<any[]> = ref([])

const resetSearch = () => {
  searchInput.value = ''
  lastSearchInput.value = ''
  suggestions.value = []
  searching.value = false
  searched.value = false
}

const clearSelection = () => {
  selection.value = null
  selectionType.value = null
  errors.value = {}
}

const handleSearch = debounce(async () => {
  lastSearchInput.value = searchInput.value
  searching.value = true

  if (!lastSearchInput.value) {
    return resetSearch()
  }

  const filters = filterify({
    email: lastSearchInput.value
  })

  const { response } = await useAsync(UserService.getAll({
    ...filters,
    path_hash: route.params.pathHash,
    invitable: 1,
    all: 1
  }))

  suggestions.value = response.data.data.items
  searched.value = true
  searching.value = false
}, 800)

const handleSelect = (value: any, type: SelectionType) => {
  selection.value = value
  selectionType.value = type
  resetSearch()
}

const sendInvitation = async () => {
  sending.value = true
  errors.value = {}

  const payload = selectionType.value === SelectionType.EMAIL
    ? { email: selection.value.email }
    : { user_hash: selection.value.hash }

  const { error } = await useAsync(PathService.invite(
    route.params.pathHash,
    payload
  ))

  if (error) {
    errors.value = formatErrors(error)
    return (sending.value = false)
  }

  resetSearch()
  emit('invite')
  clearSelection()

  sending.value = false
}
</script>
<style scoped lang="scss">
@import '@/assets/styles/components/settings.scss';
</style>