import TrelloService from '@/services/TrelloService';
import useAsync from '@/composables/useAsync';

export default () => {
  const getLabel = async (id: string, pathHash: string) => {
    const { response } = await useAsync(TrelloService.labels.getLabel(id, pathHash));
    return response.data;
  };

  const updateLabel = async (id: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.labels.updateLabel(id, payload, pathHash));
    return response.data;
  };

  const deleteLabel = async (id: string, pathHash: string) => {
    await useAsync(TrelloService.labels.deleteLabel(id, pathHash));
  };

  const updateField = async (id: string, field: string, payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.labels.updateField(id, field, payload, pathHash));
    return response.data;
  };

  const createLabel = async (payload: any, pathHash: string) => {
    const { response } = await useAsync(TrelloService.labels.createLabel(payload, pathHash));
    return response.data;
  };

  return {
    getLabel,
    updateLabel,
    deleteLabel,
    updateField,
    createLabel,
  };
};
