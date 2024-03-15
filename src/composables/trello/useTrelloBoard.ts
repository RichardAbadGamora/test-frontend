import TrelloService from '@/services/TrelloService';
import useAsync from '@/composables/useAsync';

export default () => {
  const getBoard = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.getBoard(id, pathHash));
    return response.data;
  };

  const createBoard = async (payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.createBoard(payload, pathHash));
    return response.data;
  };

  const updateBoard = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.updateBoard(id, payload, pathHash));
    return response.data;
  };

  const deleteBoard = async (id: string, pathHash: string) => {
    await useAsync(TrelloService.boards.deleteBoard(id, pathHash));
  };

  const getCard = async (id: string, idCard: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.getCard(id, idCard, pathHash));
    return response.data;
  };

  const getCards = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.getCards(id, pathHash));
    return response.data;
  };

  const getFilteredCards = async (id: string, filter: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.getFilteredCards(id, filter, pathHash));
    return response.data;
  };

  const getLists = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.getLists(id, pathHash));
    return response.data;
  };

  const getLabels = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.getLabels(id, pathHash));
    return response.data;
  };

  const createList = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.createList(id, payload, pathHash));
    return response.data;
  };

  const getFilteredLists = async (id: string, filter: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.getFilteredLists(id, filter, pathHash));
    return response.data;
  };

  const getMembers = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.getMembers(id, pathHash));
    return response.data;
  };

  const updateMembers = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.updateMembers(id, payload, pathHash));
    return response.data;
  };

  const updateMember = async (id: string, idMember: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.updateMember(id, idMember, payload, pathHash));
    return response.data;
  };

  const removeMember = async (id: string, idMember: string, pathHash: string) => {
    await useAsync(TrelloService.boards.removeMember(id, idMember, pathHash));
  };

  const updateMembership = async (id: string, idMembership: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.boards.updateMembership(id, idMembership, payload, pathHash));
    return response.data;
  };

  return {
    getBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    getCard,
    getCards,
    getFilteredCards,
    getLists,
    createList,
    getLabels,
    getFilteredLists,
    getMembers,
    updateMembers,
    updateMember,
    removeMember,
    updateMembership,
  };
};
