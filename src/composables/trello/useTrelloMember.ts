import TrelloService from '@/services/TrelloService';
import useAsync from '@/composables/useAsync';

export default () => {
  const getMemberBoards = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberBoards(id, pathHash));
    return response.data;
  };

  const getMember = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMember(id, pathHash));
    return response.data;
  };

  const updateMember = async (id: string, data: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.updateMember(id, data, pathHash));
    return response.data;
  };

  const getMemberField = async (id: string, field: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberField(id, field, pathHash));
    return response.data;
  };

  const getMemberActions = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberActions(id, pathHash));
    return response.data;
  };

  const getMemberBoardBackgrounds = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberBoardBackgrounds(id, pathHash));
    return response.data;
  };

  const createMemberBoardBackground = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.createMemberBoardBackground(id, payload, pathHash));
    return response.data;
  };

  const getMemberBoardBackground = async (id: string, idBackground: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberBoardBackground(id, idBackground, pathHash));
    return response.data;
  };

  const updateMemberBoardBackground = async (id: string, idBackground: string, data: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.updateMemberBoardBackground(id, idBackground, data, pathHash));
    return response.data;
  };

  const deleteMemberBoardBackground = async (id: string, idBackground: string, pathHash: string) => {
    await useAsync(TrelloService.members.deleteMemberBoardBackground(id, idBackground, pathHash));
  };

  const getMemberBoardStars = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberBoardStars(id, pathHash));
    return response.data;
  };

  const createMemberBoardStar = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.createMemberBoardStar(id, payload, pathHash));
    return response.data;
  };

  const getMemberBoardStar = async (id: string, idStar: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberBoardStar(id, idStar, pathHash));
    return response.data;
  };

  const updateMemberBoardStar = async (id: string, idStar: string, data: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.updateMemberBoardStar(id, idStar, data, pathHash));
    return response.data;
  };

  const deleteMemberBoardStar = async (id: string, idStar: string, pathHash: string) => {
    await useAsync(TrelloService.members.deleteMemberBoardStar(id, idStar, pathHash));
  };

  const getMemberBoardsInvited = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberBoardsInvited(id, pathHash));
    return response.data;
  };

  const getMemberCards = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberCards(id, pathHash));
    return response.data;
  };

  const getMemberCustomBoardBackgrounds = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberCustomBoardBackgrounds(id, pathHash));
    return response.data;
  };

  const createMemberCustomBoardBackground = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.createMemberCustomBoardBackground(id, payload, pathHash));
    return response.data;
  };

  const getMemberCustomBoardBackground = async (id: string, idBackground: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberCustomBoardBackground(id, idBackground, pathHash));
    return response.data;
  };

  const updateMemberCustomBoardBackground = async (id: string, idBackground: string, data: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.updateMemberCustomBoardBackground(id, idBackground, data, pathHash));
    return response.data;
  };

  const deleteMemberCustomBoardBackground = async (id: string, idBackground: string, pathHash: string) => {
    await useAsync(TrelloService.members.deleteMemberCustomBoardBackground(id, idBackground, pathHash));
  };

  const getMemberCustomEmoji = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberCustomEmoji(id, pathHash));
    return response.data;
  };

  const createMemberCustomEmoji = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.createMemberCustomEmoji(id, payload, pathHash));
    return response.data;
  };

  const getMemberCustomStickers = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberCustomStickers(id, pathHash));
    return response.data;
  };

  const createMemberCustomSticker = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.createMemberCustomSticker(id, payload, pathHash));
    return response.data;
  };

  const getMemberNotifications = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberNotifications(id, pathHash));
    return response.data;
  };

  const getMemberOrganizations = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberOrganizations(id, pathHash));
    return response.data;
  };

  const getMemberOrganizationsInvited = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberOrganizationsInvited(id, pathHash));
    return response.data;
  };

  const getMemberSavedSearches = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberSavedSearches(id, pathHash));
    return response.data;
  };

  const createMemberSavedSearch = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.createMemberSavedSearch(id, payload, pathHash));
    return response.data;
  };

  const getMemberSavedSearch = async (id: string, idSearch: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberSavedSearch(id, idSearch, pathHash));
    return response.data;
  };

  const updateMemberSavedSearch = async (id: string, idSearch: string, data: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.updateMemberSavedSearch(id, idSearch, data, pathHash));
    return response.data;
  };

  const deleteMemberSavedSearch = async (id: string, idSearch: string, pathHash: string) => {
    await useAsync(TrelloService.members.deleteMemberSavedSearch(id, idSearch, pathHash));
  };

  const getMemberTokens = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.getMemberTokens(id, pathHash));
    return response.data;
  };

  const updateMemberAvatar = async (id: string, data: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.updateMemberAvatar(id, data, pathHash));
    return response.data;
  };

  const dismissOneTimeMessages = async (id: string, data: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.members.dismissOneTimeMessages(id, data, pathHash));
    return response.data;
  };

  return {
    getMemberBoards,
    getMember,
    updateMember,
    getMemberField,
    getMemberActions,
    getMemberBoardBackgrounds,
    createMemberBoardBackground,
    getMemberBoardBackground,
    updateMemberBoardBackground,
    deleteMemberBoardBackground,
    getMemberBoardStars,
    createMemberBoardStar,
    getMemberBoardStar,
    updateMemberBoardStar,
    deleteMemberBoardStar,
    getMemberBoardsInvited,
    getMemberCards,
    getMemberCustomBoardBackgrounds,
    createMemberCustomBoardBackground,
    getMemberCustomBoardBackground,
    updateMemberCustomBoardBackground,
    deleteMemberCustomBoardBackground,
    getMemberCustomEmoji,
    createMemberCustomEmoji,
    getMemberCustomStickers,
    createMemberCustomSticker,
    getMemberNotifications,
    getMemberOrganizations,
    getMemberOrganizationsInvited,
    getMemberSavedSearches,
    createMemberSavedSearch,
    getMemberSavedSearch,
    updateMemberSavedSearch,
    deleteMemberSavedSearch,
    getMemberTokens,
    updateMemberAvatar,
    dismissOneTimeMessages,
  };
};
