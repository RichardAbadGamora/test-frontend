<template>
  <draggable tag="div" :list="tasks || []" item-key="hash" :droppable="false" :group="{ name: 'root' }"
    @change="$emit('sort')" ghost-class="task-item__ghost" :class="additionalClass" class="pb-1">
    <template #item="{ element: task, index }">
      <div>
        <TaskItem :task="task" @edit="handleEdit" @delete="handleDeleteClick(task, index)" @update="handleUpdate"
          @check="handleCheckClick(task, index)" :editing="editing(task)" :updating="updatedHash[task.hash]" />
        <TasksSubList :tasks="task.sub_tasks || []" additional-class="ml-6" v-if="level <= 1" :level="level + 1"
          @sort="$emit('sort')" :parent-index="index" item-key="hash" />
      </div>
    </template>
  </draggable>
</template>
<script setup lang="ts">
import draggable from "vuedraggable";
import TaskItem from '@/components/Tasks/TaskItem.vue';
import { computed, inject } from 'vue';

const updatedHash: any = inject('updatedHash')
const handleEdit: any = inject('handleEdit')
const updateStatus: any = inject('updateStatus')
const editing: any = inject('editing')
const handleUpdate: any = inject('handleUpdate')
const handleDelete: any = inject('handleDelete')

defineEmits(['sort'])

const props = defineProps({
  tasks: {
    required: true,
    type: Array
  },

  level: {
    type: Number,
    default: 1,
  },

  additionalClass: {
    type: String,
    default: null
  },

  parentIndex: {
    type: Number,
    default: null
  },
})

const isSubTasks = computed(() => props.level === 2)

const handleCheckClick = (task: any, index: number) => {
  isSubTasks.value ? updateStatus(task, props.parentIndex, index) : updateStatus(task, index)
}

const handleDeleteClick = (task: any, index: number) => {
  isSubTasks.value ? handleDelete(task, props.parentIndex) : handleDelete(task, index)
}
</script>
<script lang="ts">
export default {
  name: 'TasksSubList'
}
</script>
