import TrelloService from '@/services/TrelloService';
import useAsync from '@/composables/useAsync';

export default () => {
  const createOrganization = async (payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.createOrganization(payload, pathHash));
    return response.data;
  };

  const getOrganization = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.getOrganization(id, pathHash));
    return response.data;
  };

  const updateOrganization = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.updateOrganization(id, payload, pathHash));
    return response.data;
  };

  const deleteOrganization = async (id: string, pathHash: string) => {
    await useAsync(TrelloService.organizations.deleteOrganization(id, pathHash));
  };

  const getField = async (id: string, field: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.getField(id, field, pathHash));
    return response.data;
  };

  const getActions = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.getActions(id, pathHash));
    return response.data;
  };

  const getBoards = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.getBoards(id, pathHash));
    return response.data;
  };

  const getExports = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.getExports(id, pathHash));
    return response.data;
  };

  const createExport = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.createExport(id, payload, pathHash));
    return response.data;
  };

  const getMembers = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.getMembers(id, pathHash));
    return response.data;
  };

  const updateMembers = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.updateMembers(id, payload, pathHash));
    return response.data;
  };

  const getMemberships = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.getMemberships(id, pathHash));
    return response.data;
  };

  const getMembership = async (id: string, idMembership: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.getMembership(id, idMembership, pathHash));
    return response.data;
  };

  const getPluginData = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.getPluginData(id, pathHash));
    return response.data;
  };

  const getTags = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.getTags(id, pathHash));
    return response.data;
  };

  const createTag = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.createTag(id, payload, pathHash));
    return response.data;
  };

  const updateMember = async (id: string, idMember: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.updateMember(id, idMember, payload, pathHash));
    return response.data;
  };

  const deactivateMember = async (id: string, idMember: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.deactivateMember(id, idMember, pathHash));
    return response.data;
  };

  const uploadLogo = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.uploadLogo(id, payload, pathHash));
    return response.data;
  };

  const deleteLogo = async (id: string, pathHash: string) => {
    await useAsync(TrelloService.organizations.deleteLogo(id, pathHash));
  };

  const removeAllMembers = async (id: string, idMember: string, pathHash: string) => {
    await useAsync(TrelloService.organizations.removeAllMembers(id, idMember, pathHash));
  };

  const deleteAssociatedDomain = async (id: string, pathHash: string) => {
    await useAsync(TrelloService.organizations.deleteAssociatedDomain(id, pathHash));
  };

  const deleteOrgInviteRestrict = async (id: string, pathHash: string) => {
    await useAsync(TrelloService.organizations.deleteOrgInviteRestrict(id, pathHash));
  };

  const deleteTag = async (id: string, idTag: string, pathHash: string) => {
    await useAsync(TrelloService.organizations.deleteTag(id, idTag, pathHash));
  };

  const getNewBillableGuests = async (id: string, idBoard: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.organizations.getNewBillableGuests(id, idBoard, pathHash));
    return response.data;
  };

  return {
    createOrganization,
    getOrganization,
    updateOrganization,
    deleteOrganization,
    getField,
    getActions,
    getBoards,
    getExports,
    createExport,
    getMembers,
    updateMembers,
    getMemberships,
    getMembership,
    getPluginData,
    getTags,
    createTag,
    updateMember,
    deactivateMember,
    uploadLogo,
    deleteLogo,
    removeAllMembers,
    deleteAssociatedDomain,
    deleteOrgInviteRestrict,
    deleteTag,
    getNewBillableGuests,
  };
};
