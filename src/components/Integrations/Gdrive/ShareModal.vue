<template>
  <AppModal max-width="max-w-xl" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900" id="modal-title">
        {{ $t('Share') }}
      </h3>
      <form class="space-y-6 my-8" novalidate @submit.prevent="handleSubmit">
        <!-- Email input field -->
        <div>
          <label for="email" class="app__form-label">{{ $t('Email') }}</label>
          <div class="mt-2">
            <input v-model="searchQuery" placeholder="Search Emails" type="email" class="app__input" />
            <small class="app__input-error" v-if="errors.email">{{ errors.email[0] }}</small>
          </div>
        </div>
      </form>

      <div v-if="selectedUsers.length > 0" class="mb-10">
        <h4 class="text-app-sm font-semibold leading-6 text-typo-900">
          Selected
        </h4>
        <div v-for="email in selectedUsers" :key="email.id" class="flex justify-between items-center mt-2">
          <div class="flex items-center">
            <div
              class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold text-xl">
              {{ email.initials }}
            </div>
            <div class="ml-4">
              <div class="text-app-sm">
                {{ email.fullname }}
                <div class="text-app-xs">{{ email.email }}</div>
              </div>
            </div>
          </div>
          <button @click="removeSelectedUser(email.id)" class="text-gray-500 hover:text-blue-600">
            <XMarkIcon class="h-4" />
          </button>
        </div>
      </div>

      <div class="email-results mb-10">
        <h4 class="text-app-sm font-semibold leading-6 text-typo-900">
          People
        </h4>
        <div v-for="(user, key) in filteredUsers" :key="key" class="user-item">
          <div class="py-2 cursor-pointer transition-colors hover:bg-gray-100" @click="addSelectedUser(user)">
            <div class="flex items-center">
              <div
                class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold text-xl">
                {{ user.initials }}
              </div>
              <div class="ml-4">
                <div class="text-app-sm">
                  {{ user.fullname }}
                  <div class="text-app-xs">{{ user.email }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row gap-2">
      <button :disabled="loading" type="button" class="btn--light" @click="$emit('close')">
        {{ $t('Cancel') }}
      </button>
      <button :disabled="loading || selectedUsers.length === 0" type="submit" class="btn--primary"
        @click="handleSubmit()">
        <AppLoader v-if="loading" />
        <span class="text-left">
          {{ $t('Share') }}
        </span>
      </button>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, type Ref, onMounted } from 'vue';
import {
  XMarkIcon
} from '@heroicons/vue/24/outline'

import AppModal from '@/components/App/AppModal.vue'
import AppLoader from '@/components/App/AppLoader.vue'
import GdriveService from '@/services/GdriveService';
import usePathStore from '@/stores/path'
import useAsync from '@/composables/useAsync';

const emit = defineEmits(['close'])

const props = defineProps({
  page: {
    type: Object,
    required: true
  },
  file: {
    type: Object,
    required: true
  }
})

const pathStore = usePathStore()
const selectedUsers: Ref<any> = ref([]);
const loading = ref(false)
const searchQuery = ref('');
const users = ref([])
const errors: Ref<any> = ref({});

onMounted(async () => {
  await pathStore.getUsers(props.page.path_hash)
  users.value = pathStore.users
})

const addSelectedUser = (user: any) => {
  if (!selectedUsers.value.includes(user)) {
    selectedUsers.value.push(user);
  }
};

const removeSelectedUser = (emailId: number) => {
  const index = selectedUsers.value.findIndex((email: any) => email.id === emailId);
  if (index !== -1) {
    selectedUsers.value.splice(index, 1);
  }
};

const filteredUsers: Ref<any[]> = computed(() => {
  if (!searchQuery.value) {
    return users.value.filter((user: any) => !selectedUsers.value.includes(user));
  }

  const searchTerm = searchQuery.value.toLowerCase();
  return users.value.filter((user : any) => {
    return (
      (user.email.toLowerCase().includes(searchTerm) || user.fullname.toLowerCase().includes(searchTerm)) &&
      !selectedUsers.value.includes(user)
    );
  });
});

const handleSubmit = async () => {
  loading.value = true

  await useAsync(GdriveService.shareFile(props.page.integration_id, { id: props.file.id, emails: selectedUsers.value.map((email: any) => email.email) }))

  loading.value = false
  emit('close')
};
</script>