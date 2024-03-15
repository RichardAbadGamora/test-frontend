<template>
  <PageWrapper :title="page.name" :page="page">
    <template #content>
      <div class="max-h-screen overflow-hidden">
        <header class="py-4 bg-white shadow">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-app-sm font-semibold text-gray-800">{{ $t('My Drive') }}</h1>
          </div>
        </header>

        <div v-if="ready">
          <div class="flex items-center m-2">
            <button v-if="displayType === Display.GRID" @click="setDisplayType(Display.LIST)" class="ml-auto">
              <TableCellsIcon class="h-5 mr-1 text-gray-600" />
            </button>
            <button v-else @click="setDisplayType(Display.GRID)" class="ml-auto">
              <ListBulletIcon class="h-5 mr-1 text-gray-600" />
            </button>
          </div>

          <div class="m-4 relative">
            <input v-model="searchQuery" @input="performSearch" class="app__input" placeholder="Search in Drive" />
            <button v-if="searchQuery" @click="clearSearch" class="absolute right-2 top-1/2 transform -translate-y-1/2">
              <XCircleIcon class="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div class="flex items-center justify-center h-full">
            <AppLoader size="20" v-if="loading" />
          </div>

          <div class="max-h-[calc(100vh-330px)] overflow-y-auto" v-if="!loading">
            <main class="max-w-7xl mx-auto py-2 px-4">
              <ul v-if="displayType === Display.LIST" class="">
                <li v-for="file in filteredFiles" :key="file.id" class="py-1">
                  <DriveFile :file="file" @setFile="setFile" @openLink="openLink" />
                </li>
              </ul>
              <div v-else class="grid grid-cols-2 gap-4">
                <div v-for="file in filteredFiles" :key="file.id" class="py-2 px-4 bg-white rounded-lg shadow-md">
                  <DriveFile :file="file" @setFile="setFile" @openLink="openLink" />
                </div>
              </div>
            </main>
          </div>
        </div>

        <div v-else class="flex justify-center mt-10">
          <button class="btn btn--primary" @click="handleClickConnect(page.hash)">
            {{ $t('Connect to Google Drive') }}
          </button>
        </div>

        <div v-if="showMenu" class="fixed bottom-0 mb-16 left-0 right-0 bg-white border-t border-gray-200"
          :style="{ transform: `translateY(${menuTranslation}px)` }" @touchstart="onTouchStart" @touchmove="onTouchMove"
          @touchend="onTouchEnd">
          <button @click="toggleMenu" class="absolute top-2 right-2 text-gray-500 hover:text-blue-600 focus:outline-none">
            <XMarkIcon class="h-4" />
          </button>
          <ul class="py-2">
            <li v-for="menuItem in menuItems" :key="menuItem.id" class="py-3 px-4 flex items-center space-x-4">
              <button @click="handleButtonClick(menuItem.id)" class="text-gray-700 flex items-center gap-4">
                <span v-if="menuItem.id === FileMenu.SHARE">
                  <UserPlusIcon class="h-6 text-blue-600" />
                </span>
                <span v-if="menuItem.id === FileMenu.STAR">
                  <StarIcon class="h-6 text-blue-600" />
                </span>
                <span v-if="menuItem.id === FileMenu.UNSTAR">
                  <StarIcon class="h-6 text-blue-600" />
                </span>
                <span v-if="menuItem.id === FileMenu.COPY_LINK">
                  <LinkIcon class="h-6 text-blue-600" />
                </span>
                <span v-if="menuItem.id === FileMenu.RENAME">
                  <PencilIcon class="h-6 text-blue-600" />
                </span>
                <span v-if="menuItem.id === FileMenu.DETAILS">
                  <InformationCircleIcon class="h-6 text-blue-600" />
                </span>
                <span v-if="menuItem.id === FileMenu.REMOVE">
                  <TrashIcon class="h-6 text-blue-600" />
                </span>
                <span v-if="menuItem.id === FileMenu.MOVE">
                  <FolderArrowDownIcon class="h-6 text-blue-600" />
                </span>
                <span class="text-app-sm">{{ menuItem.label }} </span>
              </button>
            </li>
          </ul>
        </div>

        <button @click="handleAddButtonClick"
          class="fixed bottom-20 right-5 bg-green-600 p-4 rounded-full text-white shadow-lg hover:bg-green-700 focus:outline-none">
          <PlusIcon class="h-4 w-4" />
        </button>

        <nav
          class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16">
          <button @click="handleActiveMenuClick(Menu.HOME)"
            :class="['flex flex-col items-center', activeMenu === Menu.HOME ? 'text-blue-600' : 'text-gray-500']">
            <HomeIcon class="h-6" />
            <span class="text-app-xs mt-1">{{ $t('Home') }}</span>
          </button>
          <button @click="handleActiveMenuClick(Menu.STARRED)"
            :class="['flex flex-col items-center', activeMenu === Menu.STARRED ? 'text-blue-600' : 'text-gray-500']">
            <StarIcon class="h-6" />
            <span class="text-app-xs mt-1">{{ $t('Starred') }}</span>
          </button>
          <button @click="handleActiveMenuClick(Menu.SHARED)"
            :class="['flex flex-col items-center', activeMenu === Menu.SHARED ? 'text-blue-600' : 'text-gray-500']">
            <UsersIcon class="h-6" />
            <span class="text-app-xs mt-1">{{ $t('Shared') }}</span>
          </button>
          <button @click="handleActiveMenuClick(Menu.FILES)"
            :class="['flex flex-col items-center', activeMenu === Menu.FILES ? 'text-blue-600' : 'text-gray-500']">
            <FolderIcon class="h-6" />
            <span class="text-app-xs mt-1">{{ $t('Files') }}</span>
          </button>
        </nav>
      </div>
    </template>
  </PageWrapper>

  <Teleport to="body">
    <ShareModal v-if="showShareModal" :page="page" :file="selectedFile" @close="showShareModal = false" />
    <RenameModal v-if="showRenameModal" :page="page" :file="selectedFile" @cancel="showRenameModal = false"
      @close="showRenameModal = false; handleActiveMenuClick(activeMenu)" />
    <DetailsModal v-if="showDetailsModal" :file="selectedFile" @close="showDetailsModal = false" />
    <MoveModal v-if="showMoveModal" :page="page" :file="selectedFile" @close="showMoveModal = false" />
    <AppDeleteModal v-if="showDeleteModal" name="" @close="showDeleteModal = false" @confirm="moveToTrash"
      :loading="deleting">
      <template #title>
        <h3 class="custom-title">{{ $t('Move to trash?') }}</h3>
      </template>
      <template #description>
        <p>"{{ selectedFile.name }}" {{ $t('will be deleted forever after 30 days.') }}</p>
      </template>
      <template #confirm>
        {{ $t('Move to trash') }}
      </template>
    </AppDeleteModal>
    <FileUploadModal v-if="showFileUploadModal" name="" :page="page" @close="showFileUploadModal = false;"
      @success="showFileUploadModal = false; handleActiveMenuClick(activeMenu)" />
  </Teleport>
</template>

<script setup lang="ts">
import {
  FolderIcon,
  HomeIcon,
  StarIcon,
  UsersIcon,
  XMarkIcon,
  UserPlusIcon,
  LinkIcon,
  PencilIcon,
  InformationCircleIcon,
  TrashIcon,
  FolderArrowDownIcon,
  TableCellsIcon,
  ListBulletIcon,
  PlusIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'
import { Menu, FileMenu, Display } from '@/enums/Gdrive'
import { ref, type Ref, onMounted, computed, provide } from 'vue'
import { useI18n } from 'vue-i18n';
import useToast from '@/composables/useToast';
import AppLoader from '@/components/App/AppLoader.vue'
import PageWrapper from '@/components/Pages/PageWrapper.vue'
import ShareModal from '@/components/Integrations/Gdrive/ShareModal.vue'
import RenameModal from '@/components/Integrations/Gdrive/RenameModal.vue'
import DetailsModal from '@/components/Integrations/Gdrive/DetailsModal.vue'
import MoveModal from '@/components/Integrations/Gdrive/MoveModal.vue'
import FileUploadModal from '@/components/Integrations/Gdrive/FileUploadModal.vue'
import AppDeleteModal from '@/components/App/AppDeleteModal.vue'
import GdriveService from '@/services/GdriveService';
import useAsync from '@/composables/useAsync';
import ClipboardJS from 'clipboard';
import DriveFile from '@/components/Integrations/Gdrive/DriveFile.vue'

const props = defineProps({
  page: {
    type: Object,
    required: true
  },
})

const { t } = useI18n()
const { infoToast } = useToast();

onMounted(async () => {
  if (props.page.integration_id) {
    await fetchData()
  } else {
    setInterval(() => {
      checkLocalStorage();
    }, 1000);
  }
});

const performSearch = () => {
};

const setFile = (file: any) => {
  selectedFile.value = file
}

const openLink = (link: any) => {
  window.open(link)
}

const checkLocalStorage = () => {
  const isGdriveAuthenticated = localStorage.getItem('GDRIVE_AUTHENTICATION');

  if (isGdriveAuthenticated && isGdriveAuthenticated === 'success') {
    localStorage.removeItem('GDRIVE_AUTHENTICATION')
    window.location.reload()
  }
}

const handleClickConnect = async (pageHash: string) => {
  const { response } = await useAsync(GdriveService.makeURL(pageHash));
  window.open(response.data.data, 'popup', 'width=600,height=600');
}

const activeMenu: Ref<any> = ref(Menu.HOME)

const loading = ref(false)
const deleting = ref(false)
const showShareModal = ref(false)
const showRenameModal = ref(false)
const showDetailsModal = ref(false)
const showMoveModal = ref(false)
const showDeleteModal = ref(false)
const showFileUploadModal = ref(false)
const showMenu = ref(false);
const selectedFile: Ref<any> = ref(null)
const ready: Ref<boolean> = ref(false)
const files: Ref<any> = ref([])

const menuTranslation = ref("100%");

let touchStartY = 0;

const displayType = ref<Display.LIST | Display.GRID>(Display.LIST);

const searchQuery = ref('');
const filteredFiles = computed(() => {
  if (!searchQuery.value) {
    return files.value;
  }

  const lowercaseQuery = searchQuery.value.toLowerCase();
  return files.value.filter((file: any) => file.name.toLowerCase().includes(lowercaseQuery));
});

const clearSearch = () => {
  searchQuery.value = '';
};

const fetchData = async () => {
  const { response } = await useAsync(GdriveService.getResource(props.page.integration_id))

  if (response.data.status === 'success') {
    ready.value = true

    await listFiles()
  }
}

const listFiles = async () => {
  const { response } = await useAsync(GdriveService.listFiles(props.page.integration_id))

  files.value = response.data
}

const moveToTrash = async () => {
  deleting.value = true
  await useAsync(GdriveService.deleteFile(selectedFile.value.id, props.page.integration_id))

  const indexToRemove = files.value.findIndex((file: any) => file.id === selectedFile.value.id);
  if (indexToRemove !== -1) {
    files.value.splice(indexToRemove, 1);
  }

  deleting.value = false

  showDeleteModal.value = false;
}

const getAllStarredFiles = async () => {
  const { response } = await useAsync(GdriveService.getAllStarredFiles(props.page.integration_id))

  files.value = response.data
}

const getAllSharedFiles = async () => {
  const { response } = await useAsync(GdriveService.getAllSharedFiles(props.page.integration_id))

  files.value = response.data
}

const setDisplayType = (type: Display.LIST | Display.GRID) => {
  displayType.value = type;
};

const onTouchStart = (event: TouchEvent) => {
  touchStartY = event.touches[0].clientY;
};

const onTouchMove = (event: TouchEvent) => {
  const deltaY = event.touches[0].clientY - touchStartY;
  menuTranslation.value = `${Math.min(Math.max(0, deltaY), window.innerHeight)}px`;
};

const onTouchEnd = () => {
  touchStartY = 0;
  if (parseInt(menuTranslation.value) > window.innerHeight / 2) {
    toggleMenu();
  } else {
    menuTranslation.value = "0px";
  }
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const handleAddButtonClick = () => {
  showFileUploadModal.value = true
}
const handleButtonClick = async (id: any) => {
  showMenu.value = false

  if (id === FileMenu.SHARE) {
    showShareModal.value = true
  } else if (id === FileMenu.RENAME) {
    showRenameModal.value = true
  } else if (id === FileMenu.DETAILS) {
    showDetailsModal.value = true
  } else if (id === FileMenu.COPY_LINK) {
    ClipboardJS.copy(selectedFile.value.webViewLink)
    infoToast(t('Link copied'))
  } else if (id === FileMenu.MOVE) {
    showMoveModal.value = true
  } else if (id === FileMenu.REMOVE) {
    showDeleteModal.value = true
  } else if (id === FileMenu.STAR) {
    loading.value = true
    await useAsync(GdriveService.addToStarred(props.page.integration_id, { id: selectedFile.value.id }));
  } else if (id === FileMenu.UNSTAR) {
    loading.value = true
    await useAsync(GdriveService.removeFromStarred(props.page.integration_id, { id: selectedFile.value.id }));
  }

  if ([FileMenu.STAR, FileMenu.UNSTAR].includes(id)) {
    await handleActiveMenuClick(activeMenu.value)
  }
}

const handleActiveMenuClick = async (menu: string) => {
  loading.value = true
  activeMenu.value = menu
  if (menu === Menu.HOME) {
    await listFiles()
  } else if (menu === Menu.STARRED) {
    await getAllStarredFiles()
  } else if (menu === Menu.SHARED) {
    await getAllSharedFiles()
  } else if (menu === Menu.FILES) {
    await listFiles()
  }
  loading.value = false
}

const menuItems = computed(() => {
  const items = [
    { id: FileMenu.SHARE, label: t('Share') },
    selectedFile.value.starred
      ? { id: FileMenu.UNSTAR, label: t('Remove from Starred') }
      : { id: FileMenu.STAR, label: t('Add to Starred') },
    { id: FileMenu.COPY_LINK, label: t('Copy Link') },
    { id: FileMenu.RENAME, label: t('Rename') },
    { id: FileMenu.MOVE, label: t('Move') },
    { id: FileMenu.DETAILS, label: t('Details') },
    { id: FileMenu.REMOVE, label: t('Remove') },
  ];

  return items;
});

provide('toggleMenu', toggleMenu)
</script>
