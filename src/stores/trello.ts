import useTrelloBoard from '@/composables/trello/useTrelloBoard'
import useTrelloOrganization from '@/composables/trello/useTrelloOrganization'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export default defineStore('trello', () => {
  const organizationMembers: Ref<any> = ref([])
  const boardLabels = ref([])

  const { getMembers } = useTrelloOrganization();
  const { getLabels } = useTrelloBoard();

  const setOrganizationMembers = async (id: string, pathHash: string) => {
    organizationMembers.value = await getMembers(id, pathHash);
  };

  const setBoardLabels = async (id: string, pathHash: string) => {
    boardLabels.value = await getLabels(id, pathHash);
  };

  const getField = (field: string) => {
    return organizationMembers.value[field];
  };

  const getMemberById = (id: string) => {
    return organizationMembers.value.find((member: any) => member.id === id) || null;
  };

  return {
    organizationMembers,
    setOrganizationMembers,
    boardLabels,
    setBoardLabels,
    getField,
    getMemberById
  }
})
