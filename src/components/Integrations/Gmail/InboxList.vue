<template>
  <table class="h-full w-full table-auto">
    <tbody class="block h-full max-h-full overflow-auto py-4">
      <template v-for="(inbox,i) in inboxes" :key="i">
        <InboxItem :inbox="inbox" :integration_id="integration_id" :handleViewIndox="handleViewIndox"  @update:selected="inbox.selected = $event" :width="width" />
      </template>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import InboxItem from '@/components/Integrations/Gmail/InboxItem.vue';


defineProps({
  inboxes: {
    type: Object,
    required: true
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
