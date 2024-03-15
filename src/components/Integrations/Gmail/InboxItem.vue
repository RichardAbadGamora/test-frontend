<template>
  <tr ref="inboxItemRow" class="flex cursor-pointer items-center hover:bg-box dark:hover:bg-box dark-2"
    v-bind:class="{'border-y-2 py-4': [1,2].includes(width)}">
    <template v-if="[3,4].includes(width)">
      <td class="pl-4 pr-2">
        <input :checked="props.inbox.selected"
          @change="$emit('update:selected', !props.inbox.selected)"  id="default-checkbox" type="checkbox" class="rounded ">
      </td>
      <td  class="w-[65%] pl-4 xl:w-[25%] truncate" @click="handleViewIndox(inbox.messageId)" >
        {{  inbox.from_name?? inbox.from_email  }}
      </td>
      <td class="w-3/5 p-2 xl:block " @click="handleViewIndox(inbox.messageId)" >
        {{  inbox.snippet }}
      </td>
      <td class="w-[35%] text-right lg:pr-4 xl:w-[20%] truncate">{{ inbox.relative_time }}</td>
    </template>
    <template v-else-if="[1,2].includes(width)">
      <td class="px-2 flex-none">
        <input :checked="props.inbox.selected"
          @change="$emit('update:selected', !props.inbox.selected)"  id="default-checkbox" type="checkbox" class="rounded ">
      </td>
      <td class="flex-grow " @click="handleViewIndox(inbox.messageId)" >
        <div class="flex flex-col flex-grow ml-3 w-100">
          <div class="flex items-center">
            <div class="text-app-base font-medium flex-1">
              {{  inbox.from_name?? inbox.from_email  }}
            </div>
            <div class="flex-0 text-app-base font-light">
              {{ inbox.relative_time }}
            </div>
          </div>
          <div class="text-app-sm text-ellipsis ">{{  inbox.snippet }}</div>
        </div>
      </td>
    </template>

  </tr>
</template>

<script setup lang="ts">

const props = defineProps({
  inbox: {
    type: Object,
    required: true,

  },
  integration_id: {
    type: Number,
    required: true
  },
  handleViewIndox: {
    type: Function,
    required: true
  },
  width: {
    type: Number,
    default: 0,
    required: false
  }
})
</script>
