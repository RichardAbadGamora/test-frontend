<template>
  <PageWrapper :title="page.name" :page="page">
    <template #content>
      <div class="content--figma">
        <div class="figma__preview" v-html="page.meta?.embed_code"></div>
        <span v-if="showCommentHelpText" class="figma__comment-help">
          <ChatBubbleLeftRightIcon class="h-4 shrink-0" />
          <p>{{ $t('figma-embed:comment-help-text') }}</p>
          <XMarkIcon class="h-4 shrink-0 cursor-pointer text-typo-400 hover:text-typo" @click="handleXClick" />
        </span>
      </div>
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageWrapper from '@/components/Pages/PageWrapper.vue';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue';

defineProps({
  page: {
    type: Object,
    required: true
  },
})

const showCommentHelpText = ref(sessionStorage.figmaShowCommentHelpText !== '1')

const handleXClick = () => {
  sessionStorage.figmaShowCommentHelpText = 1
  showCommentHelpText.value = false;
}

</script>
<style lang="scss">
.content--figma {
  @apply overflow-auto h-full relative;

  .figma__preview {
    @apply w-full h-full;

    iframe {
      @apply w-full h-full border-none;
    }

    +.figma__comment-help {
      @apply absolute bottom-[8px] z-[1] ml-2 right-[8px] inline-flex items-center text-app-xs p-1.5 bg-gray-100 border shadow-lg gap-2;
    }
  }
}
</style>
