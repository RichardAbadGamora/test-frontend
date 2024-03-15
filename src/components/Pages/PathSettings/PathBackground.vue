<template>
  <div>
    <label for="name" class="setting-section__title">{{ $t('Path Background') }}</label>
    <p class="setting-section__description">
      {{ $t('user-settings:path-background') }}
    </p>
    <div class="mt-2">
      <div class="relative w-full">
        <div class="mt-2 flex gap-2">
          <button
            type="button"
            class="btn btn--light"
            @click="setBackgroundType(BackgroundType.COLOR)"
            v-tooltip="$t('Color')"
            :class="{ '!bg-gray-100 !shadow-none dark:text-typo-900': isColor }"
            :disabled="!canUpdatePathBackground"
          >
            <PaintBrushIcon class="h-5" />
          </button>
          <button
            :disabled="!canUpdatePathBackground"
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
      <form class="space-y-6 mt-2" novalidate @submit.prevent>
        <div v-if="form.bg_type">
          <div class="mt-2">
            <template v-if="isColor">
              <AppPathBgColor :current="form.bg_value" @selected-color="handleColorChange"/>
            </template>
            <AppFileInput
              v-if="isImage"
              :current="form?.bg_image"
              :file="file"
              @change="handleFileChange"
              :accept="COMMON_IMAGE_EXTS"
            />
            <div class="leading-3 mt-3">
              <span class="text-app-xs italic text-typo-500 dark:text-typo-400">{{
                $t('path-settings:path-background-help-text')
              }}</span>
            </div>
            <small class="app__input-error" v-if="errors.bg_value">{{ errors.bg_value[0] }}</small>
            <div class="flex flex-row gap-2 mt-5">
              <button
                :disabled="loading || !canUpdatePathBackground"
                type="submit"
                class="btn--primary dark:!bg-gray-700"
                @click="handleSubmit"
              >
                <AppLoader size="14" v-if="loading" />
                <span class="text-left">
                  {{ $t('Save') }}
                </span>
              </button>
              <button
                v-if="isColor || !canUpdatePathBackground"
                :disabled="loading || !canUpdatePathBackground"
                type="button"
                class="btn--light"
                @click="resetPathBackground"
              >
                {{ $t('Reset') }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, type Ref, onMounted, computed } from 'vue'
import useError from '@/composables/useError'
import usePathStore from '@/stores/path'
import AppLoader from '@/components/App/AppLoader.vue'
import useAsync from '@/composables/useAsync'
import { PhotoIcon, PaintBrushIcon } from '@heroicons/vue/24/outline'
import { BackgroundType } from '@/enums/Path'
import { COMMON_IMAGE_EXTS, objectToFormData } from '@/helpers/form'
import PathService from '@/services/PathService'
import { FileAction } from '@/enums/File'
import AppFileInput from '@/components/App/AppFileInput.vue'
import usePermission from '@/composables/usePermission'
import AppPathBgColor from '@/components/App/AppPathBgColor.vue'

const { formatErrors } = useError()
const pathStore = usePathStore()
const { userCan } = usePermission()

const errors: Ref<any> = ref({})
const form: Ref<any> = ref({
  bg_type: pathStore.current.bg_type,
  bg_value: pathStore.current.bg_value,
  bg_image: pathStore.current.bg_image
})
const file: any = ref(null)
const loading: Ref<boolean> = ref(false)
const oldBgValue: Ref<string> = ref('')

const props = defineProps({
  pathHash: {
    type: String,
    required: true
  }
})
const canUpdatePathBackground = computed(() => userCan('path-settings:update-page-background'))

const isImage = computed(() => form.value.bg_type === BackgroundType.IMAGE)
const isColor = computed(() => form.value.bg_type === BackgroundType.COLOR)

onMounted(() => {
  oldBgValue.value = pathStore.current.bg_value
})

const handleSubmit = async () => {
  loading.value = true

  sessionStorage.pathBgColor = form.value.bg_value

  if (form.value.bg_type === BackgroundType.IMAGE) {
    form.value.bg_value = file.value
  }

  const payload = objectToFormData(form.value)

  const { error, response } = await useAsync(
    PathService.updatePathBackground(props.pathHash, payload)
  )

  if (error) {
    errors.value = formatErrors(error)

    return (loading.value = false)
  }

  loading.value = false

  pathStore.current = response.data.data
  location.reload()
}

const setBackgroundType = (type: string) => {
  if (type === BackgroundType.COLOR) {
    pathStore.bgValue = form.value.bg_value
  }
  pathStore.bgType = type
  form.value.bg_type = type
  form.value.file_action = FileAction.CHANGE
}

const handleFileChange = async (e: any) => {
  const selectedFile = e.target?.files?.[0]
  if (!selectedFile) {
    return
  }

  const reader = new FileReader()
  reader.onload = (event: any) => {
    const base64Data = event.target.result

    pathStore.bgType = form.value.bg_type
    pathStore.bgValue = base64Data
  }

  reader.readAsDataURL(selectedFile)

  file.value = selectedFile
  form.value.file_action = FileAction.CHANGE
}

const handleColorChange = (value: any) => {
  pathStore.bgType = BackgroundType.COLOR
  pathStore.bgValue = value
  form.value.bg_value = value
}

const resetPathBackground = () => {
  form.value.bg_value = oldBgValue.value
  pathStore.bgType = form.value.bg_type
  pathStore.bgValue = oldBgValue.value
}
</script>
<style scoped lang="scss">
@import '@/assets/styles/components/settings.scss';
</style>