<template>
  <div class="app__input relative px-1.5 !flex justify-between bg-white">
    <!-- Invisible, stretched color input -->
    <input :disabled="disabled" class="opacity-0 absolute inset-0 z-[1] w-full h-full" type="color" v-model="hex">

    <!-- Visible Color HEX Value -->
    <span>{{ hex }}</span>

    <!-- Visible Color Preview -->
    <div class="w-6 h-6 rounded" :style="{ 'background': hex }"></div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: '#000000'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const hex = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
