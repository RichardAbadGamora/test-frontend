import TrelloService from '@/services/TrelloService';
import useAsync from '@/composables/useAsync';

export default () => {
  const getList = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.lists.getList(id, pathHash));
    return response.data;
  };

  const createList = async (payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.lists.createList(payload, pathHash));
    return response.data;
  };

  const updateList = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.lists.updateList(id, payload, pathHash));
    return response.data;
  };

  const getCards = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.lists.getCards(id, pathHash));
    return response.data;
  };

  const closeList = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.lists.closeList(id, payload, pathHash));
    return response.data;
  };

  const archiveAllCards = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.lists.archiveAllCards(id, payload, pathHash));
    return response.data;
  };

  const moveAllCards = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.lists.moveAllCards(id, payload, pathHash));
    return response.data;
  };

  const changeBoard = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.lists.changeBoard(id, payload, pathHash));
    return response.data;
  };

  const updateField = async (id: string, field: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.lists.updateField(id, field, payload, pathHash));
    return response.data;
  };

  const getActions = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.lists.getActions(id, pathHash));
    return response.data;
  };

  const getBoard = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.lists.getBoard(id, pathHash));
    return response.data;
  };

  return {
    getList,
    createList,
    updateList,
    getCards,
    closeList,
    archiveAllCards,
    moveAllCards,
    changeBoard,
    updateField,
    getActions,
    getBoard,
  };
};
