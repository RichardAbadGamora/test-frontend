import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export default defineStore('gmail', () => {

    const pageInboxes: Ref<{ [key: string]: any }> = ref({});
    const setPageInbox = (data: any) => {
        Object.assign(pageInboxes.value, data);
    };
    const pageTokens: Ref<{ [key: string]: any }> = ref({});
    const setPageToken = (data: any) => {
        Object.assign(pageTokens.value, data);
    };

    return {
        pageInboxes,
        setPageInbox,
        pageTokens,
        setPageToken
    }
})
