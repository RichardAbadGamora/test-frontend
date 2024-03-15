<template>
  <div>
    <div class="mb-4 flex justify-between">
      <div>
        <h4 class="setting-section__title">
          {{ $t('Path Background') }}
        </h4>
        <p class="setting-section__description">
          {{ $t('user-settings:path-background') }}
        </p>
      </div>
    </div>
    <form class="space-y-6" novalidate @submit.prevent>
      <div class="flex justify-between">
        <div class="mt-2 flex gap-2">
          <button
            type="button"
            class="btn btn--light"
            @click="setBackgroundType(BackgroundType.COLOR)"
            v-tooltip="$t('Color')"
            :class="{ '!bg-gray-100 !shadow-none dark:text-typo-900': isColor }"
          >
            <PaintBrushIcon class="h-5" />
          </button>
          <button
            type="button"
            class="btn btn--light"
            @click="setBackgroundType(BackgroundType.IMAGE)"
            v-tooltip="$t('Image')"
            :class="{ '!bg-gray-100 !shadow-none dark:text-typo-900': isImage }"
          >
            <PhotoIcon class="h-5" />
          </button>
        </div>
      </div>
      <div v-if="form.bg_type">
        <div class="mt-2">
          <template v-if="isColor">
            <AppPathBgColor :current="form.bg_value" @selected-color="handleChangeColor" />
          </template>
          <AppFileInput
            v-if="isImage"
            :current="form?.path_bg_image"
            :file="file"
            @change="handleFileChange"
            :accept="COMMON_IMAGE_EXTS"
          />
          <small class="app__input-error" v-if="errors.bg_value">{{ errors.bg_value[0] }}</small>
        </div>
      </div>
    </form>
  </div>
  <span class="text-app-xs italic text-typo-500 dark:text-typo-400">{{
    $t('user-settings:path-background-help-text')
  }}</span>
  <div class="flex !mt-3">
    <button type="submit" class="btn--primary" @click="handleSubmit()" :disabled="loading">
      <AppLoader size="14" v-if="loading" />
      <span class="flex items-center">
        <small>{{ $t('Apply') }} {{ $t('bg-apply:existing-and-future') }}</small>
      </span>
    </button>
    <button :disabled="loading" type="button" class="btn--light ml-2" @click="resetPathBackground">
      {{ $t('Reset') }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, type Ref } from 'vue'
import { BackgroundType } from '@/enums/Path'
import { FileAction } from '@/enums/File'
import { PhotoIcon, PaintBrushIcon } from '@heroicons/vue/24/outline'
import { COMMON_IMAGE_EXTS, objectToFormData } from '@/helpers/form'
import AppLoader from '@/components/App/AppLoader.vue'
import useAsync from '@/composables/useAsync'
import AppFileInput from '@/components/App/AppFileInput.vue'
import useError from '@/composables/useError'
import UserService from '@/services/UserService'
import useUserStore from '@/stores/user'
import usePathStore from '@/stores/path'
import usePermission from '@/composables/usePermission'
import AppPathBgColor from '@/components/App/AppPathBgColor.vue'
const { formatErrors } = useError()
const { userCan } = usePermission()

const userStore = useUserStore()
const pathStore = usePathStore()

const isImage = computed(() => form.value.bg_type === BackgroundType.IMAGE)
const isColor = computed(() => form.value.bg_type === BackgroundType.COLOR)

const defaultForm = {
  bg_type: '',
  bg_value: ''
}

const errors: Ref<any> = ref({})
const file: any = ref(null)
const form: Ref<any> = ref({ ...defaultForm })
const loading: Ref<boolean> = ref(false)
const base64Image: Ref<string> = ref('')
const oldPathBgValue: Ref<string> = ref('')
  const oldPathBgType: Ref<string> = ref('')

onBeforeMount(() => {
  form.value = userStore.info
  form.value.file_action = FileAction.KEEP

  oldPathBgValue.value = pathStore.current.bg_value
  oldPathBgType.value = pathStore.current.bg_type
})

onMounted(() => {
  form.value.bg_type = userStore.info.path_bg_type
  form.value.bg_value = userStore.info.path_bg_value
})

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  if (form.value.bg_type === BackgroundType.IMAGE) {
    form.value.bg_value = file.value
  }

  const payload = objectToFormData(form.value)

  payload.delete('path_bg_type')
  payload.delete('path_bg_value')

  const { error } = await useAsync(UserService.updatePathBackground(payload))

  loading.value = false

  if (error) {
    errors.value = formatErrors(error)
  }
}

const handleFileChange = async (e: any) => {
  const selectedFile = e.target?.files?.[0]
  if (!selectedFile) {
    return
  }

  const reader = new FileReader()
  reader.onload = (event: any) => {
    const base64Data = event.target.result

    base64Image.value = base64Data

    if (userCan('user-settings:update-path-background')) {
      pathStore.bgType = BackgroundType.IMAGE
      pathStore.bgValue = base64Data
    }
  }

  reader.readAsDataURL(selectedFile)

  file.value = selectedFile
  form.value.file_action = FileAction.CHANGE

  clearInput()
}

const clearInput = () => {
  const fileUploader: any = document.getElementById('app__file-input')
  fileUploader.value = null
}

const setBackgroundType = (type: string) => {
  if (type === BackgroundType.IMAGE) {
    form.value.bg_value = null
    pathStore.bgValue = ''
  }

  form.value.bg_type = type
  form.value.path_bg_type = type
  form.value.file_action = FileAction.CHANGE

  pathStore.bgType = type
}

const handleChangeColor = (value: any) => {
  if (userCan('user-settings:update-path-background')) {
    pathStore.bgType = BackgroundType.COLOR
    pathStore.bgValue = value
    form.value.bg_value = value
  }
}

const resetPathBackground = () => {
  if (userCan('user-settings:update-path-background')) {
    form.value.bg_value = oldPathBgValue.value
    form.value.bg_type = oldPathBgType.value

    pathStore.bgType = oldPathBgType.value
    pathStore.bgValue = oldPathBgValue.value
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/styles/components/settings.scss';
</style>