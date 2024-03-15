<template>
  <PageWrapper :title="page.name" :page="page" :loading="loading">
    <template #content>
      <div class="overflow-auto h-full py-5 px-3 flex flex-col gap-8 hide__scrollbar">
        <div class="space-y-1">
          <span class="text-app-xs mt-1.5 text-typo-600 dark:text-typo-50 !leading-6">{{ errorMessage }}</span>
          <TaskList :tasks="tasks" @sort="handleSort" />
          <div class="task__new">
            <div
              v-if="canCreate"
              class="flex items-center flex-1 gap-1 my-2 folder__item bg-white hover:bg-gray-50 border-2 border-dashed dark:border-gray-600 text-typo-400 hover:text-typo-500"
              :class="{ 'border-2 border-transparent dark:border-gray-600': newItem }"
            >
              <PlusIcon
                v-if="!adding"
                class="h-5 shrink-0 text-typo-400 cursor-pointer rounded pl-3"
              />
              <div v-else class="pl-3">
                <AppLoader size="14" />
              </div>

              <div class="flex-1 ml-2">
                <input
                  v-if="newItem"
                  v-model="newItem.name"
                  type="text"
                  class="app__input task__input--new !border-none !ring-0 !shadow-none !rounded-none !pl-2 !py-2.5 !text-app-xs"
                  :disabled="adding"
                  :placeholder="$t('Add new')"
                  @input="handleDebounceTaskAdd"
                  @keypress.enter="(e: any) => e.target.blur()"
                />
                <p
                  v-else
                  class="block w-full pl-2 pr-3 py-1.5 text-app-xs leading-6 text-typo-400 cursor-pointer"
                  @click="initNewItem()"
                >
                  {{ $t('Add new') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { Access } from '@/enums/App'
import { Status as TaskStatus } from '@/enums/Task'
import { computed, nextTick, onMounted, provide, ref, type Ref } from 'vue'
import AppLoader from '@/components/App/AppLoader.vue'
import TaskList from '@/components/Tasks/TaskList.vue'
import useAsync from '@/composables/useAsync'
import taskServiceFactory from '@/services/TaskServiceFactory'
import debounce from 'lodash.debounce'
import usePermission from '@/composables/usePermission'
import PageWrapper from '@/components/Pages/PageWrapper.vue'
import useError from '@/composables/useError'

const { userCan } = usePermission()
const { formatErrors } = useError()
const route = useRoute()

const defaultNewItem = {
  name: ''
}

const props = defineProps({
  page: {
    type: Object,
    required: true
  }
})

const loading: Ref<boolean> = ref(false)
const adding: Ref<boolean> = ref(false)
const updatedHash: Ref<any> = ref({})
const tasks: Ref<any[]> = ref([])
const newItem: Ref<any> = ref(null)
const target: Ref<any> = ref(null)
const errorMessage: Ref<string> = ref('')

const taskService = computed(() => taskServiceFactory(props.page.access as Access))

const canCreate = computed(() => userCan(`${props.page.access}-tasks:create`))
const canUpdate = computed(() => userCan(`${props.page.access}-tasks:update`))
const canDelete = computed(() => userCan(`${props.page.access}-tasks:delete`))

onMounted(async () => {
  loadTasks()
})

const initNewItem = () => {
  newItem.value = { ...defaultNewItem }

  nextTick(() => {
    const input: any = document.querySelector('.task__input--new')
    input.focus()
  })
}

const handleEdit = (item: any) => {
  target.value = { ...item }
}

const handleSort = debounce(async () => {
  errorMessage.value = ''

  const payload = tasks.value.map((task, index) => ({
    hash: task.hash,
    order: index + 1,
    task_hash: null,
    sub_tasks: (task.sub_tasks || []).map((subTask: any, childIndex: number) => ({
      hash: subTask.hash,
      order: childIndex + 1,
      task_hash: task.hash
    }))
  }))

  await taskService.value
    .reposition({
      tasks: payload,
      path_hash: route.params.pathHash
    })
    .catch((error) => {
      errorMessage.value = formatErrors(error).overview
      loadTasks()
    })
}, 250)

const updateStatus = async (item: any, parentIndex: any, childIndex: any = undefined) => {
  const subTasks = item.sub_tasks || []

  updatedHash.value[item.hash] = true
  subTasks.forEach((task: any) => (updatedHash.value[task.hash] = true))

  const status = item.status === TaskStatus.OPEN ? TaskStatus.COMPLETED : TaskStatus.OPEN

  await useAsync(
    taskService.value.updateStatus(item.hash, {
      status,
      path_hash: route.params.pathHash
    })
  )

  if (item.task_hash) {
    // if the updated task is a child task
    tasks.value[parentIndex].sub_tasks[childIndex].status = status
  } else {
    tasks.value[parentIndex].status = status
    tasks.value[parentIndex].sub_tasks.forEach((task: any) => (task.status = status))
  }

  delete updatedHash.value[item.hash]
  subTasks.forEach((task: any) => delete updatedHash.value[task.hash])
}

const editing = (task: any) => {
  return target.value?.hash === task.hash
}

const loadTasks = async () => {
  loading.value = true

  const { response } = await useAsync(
    taskService.value.getAll({ all: 1, 'include[]': ['subTasks'], page_hash: props.page.hash })
  )

  tasks.value = response.data.data.items

  loading.value = false
}

const handleTaskAdd = async () => {
  const { name } = newItem.value

  if (!name) {
    return (newItem.value = null)
  }

  adding.value = true

  const { response } = await useAsync(
    taskService.value.create({
      page_hash: props.page.hash,
      name,
      status: TaskStatus.OPEN
    })
  )

  tasks.value.push({ ...response.data.data, sub_tasks: [] })

  adding.value = false
  newItem.value = null
}

const handleDebounceTaskAdd = debounce(handleTaskAdd, 1000)

const handleUpdate = async (item: any) => {
  if (target.value.name === item.name) {
    return (target.value = null)
  }

  updatedHash.value[item.hash] = true

  const index = tasks.value.findIndex(({ hash }) => item.hash == hash)

  if (index > -1) {
    tasks.value[index] = item
  }

  target.value = null

  await taskService.value.update(item.hash, item)
  delete updatedHash.value[item.hash]
}

const handleDelete = async (item: any, parentIndex: any) => {
  loading.value = true

  const checkSameHash = (t: any) => t.hash === item.hash

  if (item.task_hash) {
    // if the updated task is a child task
    const subTasks = tasks.value[parentIndex].sub_tasks
    const index = subTasks.findIndex(checkSameHash)
    if (index > -1) {
      subTasks.splice(index, 1)
    }
  } else {
    const index = tasks.value.findIndex(checkSameHash)
    if (index > -1) {
      tasks.value.splice(index, 1)
    }
  }

  await useAsync(
    taskService.value.delete(item.hash, {
      path_hash: item.path_hash
    })
  )

  loading.value = false
}

provide('updatedHash', updatedHash)
provide('handleEdit', handleEdit)
provide('updateStatus', updateStatus)
provide('editing', editing)
provide('handleUpdate', handleUpdate)
provide('handleDelete', handleDelete)
provide('canUpdate', canUpdate.value)
provide('canDelete', canDelete.value)
</script>
<style lang="scss" scoped>
@import '@/assets/styles/components/folder.scss';
.task__input--new {
  @apply bg-transparent dark:text-typo-50 dark:focus:bg-gray-800;
}
</style>
