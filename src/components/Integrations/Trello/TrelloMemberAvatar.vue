<template>
  <div :class="`w-${hxw} h-${hxw}`"
    class="rounded-full bg-blue-200 flex items-center justify-center text-white mr-1 mb-1">
    <div v-if="member">
      <img v-if="(member as any).avatarUrl" :src="`${(member as any).avatarUrl}/${pngSize}.png`" alt="Avatar"
        class="w-full h-full rounded-full">
      <div v-else class="w-full h-full flex items-center justify-center">>{{ (member as any).initials }}</div>
    </div>

  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  member: {
    type: Object,
    default: null
  };
  hxw?: number;
  pngSize?: number;
}>();

const hxw = props.hxw || 6;
const pngSize = props.pngSize || 50;
</script>
