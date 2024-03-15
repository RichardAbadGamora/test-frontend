import TrelloService from '@/services/TrelloService';
import useAsync from '@/composables/useAsync';

export default () => {

  const createCard = async (payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.createCard(payload, pathHash));
    return response.data;
  };

  const updateCard = async (cardId: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.updateCard(cardId, payload, pathHash));
    return response.data;
  };

  const deleteCard = async (id: string, pathHash: string) => {
    await useAsync(TrelloService.cards.deleteCard(id, pathHash));
  };

  const getCard = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getCard(id, pathHash));
    return response.data;
  };

  const getField = async (id: string, field: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getField(id, field, pathHash));
    return response.data;
  };

  const getActions = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getActions(id, pathHash));
    return response.data;
  };

  const getAttachments = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getAttachments(id, pathHash));
    return response.data;
  };

  const createAttachment = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.createAttachment(id, payload, pathHash));
    return response.data;
  };

  const getAttachment = async (id: string, idAttachment: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getAttachment(id, idAttachment, pathHash));
    return response.data;
  };

  const deleteAttachment = async (id: string, idAttachment: string, pathHash: string) => {
    await useAsync(TrelloService.cards.deleteAttachment(id, idAttachment, pathHash));
  };

  const getBoard = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getBoard(id, pathHash));
    return response.data;
  };

  const getCheckItemStates = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getCheckItemStates(id, pathHash));
    return response.data;
  };

  const getChecklists = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getChecklists(id, pathHash));
    return response.data;
  };

  const createChecklist = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.createChecklist(id, payload, pathHash));
    return response.data;
  };

  const getCheckItem = async (id: string, idCheckItem: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getCheckItem(id, idCheckItem, pathHash));
    return response.data;
  };

  const updateCheckItem = async (id: string, idCheckItem: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.updateCheckItem(id, idCheckItem, payload, pathHash));
    return response.data;
  };

  const deleteCheckItem = async (id: string, idCheckItem: string, pathHash: string) => {
    await useAsync(TrelloService.cards.deleteCheckItem(id, idCheckItem, pathHash));
  };

  const getList = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getList(id, pathHash));
    return response.data;
  };

  const getMembers = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getMembers(id, pathHash));
    return response.data;
  };

  const getMembersVoted = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getMembersVoted(id, pathHash));
    return response.data;
  };

  const createMembersVoted = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.createMembersVoted(id, payload, pathHash));
    return response.data;
  };

  const getPluginData = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getPluginData(id, pathHash));
    return response.data;
  };

  const getStickers = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getStickers(id, pathHash));
    return response.data;
  };

  const createSticker = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.createSticker(id, payload, pathHash));
    return response.data;
  };

  const getSticker = async (id: string, idSticker: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getSticker(id, idSticker, pathHash));
    return response.data;
  };

  const updateSticker = async (id: string, idSticker: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.updateSticker(id, idSticker, payload, pathHash));
    return response.data;
  };

  const deleteSticker = async (id: string, idSticker: string, pathHash: string) => {
    await useAsync(TrelloService.cards.deleteSticker(id, idSticker, pathHash));
  };

  const updateActionsComment = async (id: string, idAction: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.updateActionsComment(id, idAction, payload, pathHash));
    return response.data;
  };

  const deleteActionsComment = async (id: string, idAction: string, pathHash: string) => {
    await useAsync(TrelloService.cards.deleteActionsComment(id, idAction, pathHash));
  };

  const updateCustomFieldItem = async (id: string, idCustomField: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.updateCustomFieldItem(id, idCustomField, payload, pathHash));
    return response.data;
  };

  const updateCustomFields = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.updateCustomFields(id, payload, pathHash));
    return response.data;
  };

  const getCustomFieldItems = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.getCustomFieldItems(id, pathHash));
    return response.data;
  };

  const createActionsComment = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.createActionsComment(id, payload, pathHash));
    return response.data;
  };

  const createIdLabels = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.createIdLabels(id, payload, pathHash));
    return response.data;
  };

  const addMember = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.addMember(id, payload, pathHash));
    return response.data;
  };

  const createLabels = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.createLabels(id, payload, pathHash));
    return response.data;
  };

  const markAssociatedNotificationsRead = async (id: string, pathHash: string) => {
    await useAsync(TrelloService.cards.markAssociatedNotificationsRead(id, pathHash));
  };

  const deleteIdLabels = async (id: string, idLabel: string, pathHash: string) => {
    await useAsync(TrelloService.cards.deleteIdLabels(id, idLabel, pathHash));
  };

  const deleteMember = async (id: string, idMember: string, pathHash: string) => {
    await useAsync(TrelloService.cards.deleteMember(id, idMember, pathHash));
  };

  const deleteMembersVoted = async (id: string, idMember: string, pathHash: string) => {
    await useAsync(TrelloService.cards.deleteMembersVoted(id, idMember, pathHash));
  };

  const updateChecklistCheckItem = async (id: string, idChecklist: string, idCheckItem: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.cards.updateChecklistCheckItem(id, idChecklist, idCheckItem, pathHash));
    return response.data;
  };

  const deleteChecklist = async (id: string, idChecklist: string, pathHash: string) => {
    await useAsync(TrelloService.cards.deleteChecklist(id, idChecklist, pathHash));
  };

  return {
    createCard,
    updateCard,
    deleteCard,
    getCard,
    getField,
    getActions,
    getAttachments,
    createAttachment,
    getAttachment,
    deleteAttachment,
    getBoard,
    getCheckItemStates,
    getChecklists,
    createChecklist,
    getCheckItem,
    updateCheckItem,
    deleteCheckItem,
    getList,
    getMembers,
    getMembersVoted,
    createMembersVoted,
    getPluginData,
    getStickers,
    createSticker,
    getSticker,
    updateSticker,
    deleteSticker,
    updateActionsComment,
    deleteActionsComment,
    updateCustomFieldItem,
    updateCustomFields,
    getCustomFieldItems,
    createActionsComment,
    createIdLabels,
    addMember,
    createLabels,
    markAssociatedNotificationsRead,
    deleteIdLabels,
    deleteMember,
    deleteMembersVoted,
    updateChecklistCheckItem,
    deleteChecklist,
  };
};
