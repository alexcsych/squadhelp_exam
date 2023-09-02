import http from '../interceptor';

export const registerRequest = data => http.post('registration', data);
export const loginRequest = data => http.put('login', data);
export const getUser = () => http.get('getUser');
export const updateContest = data => http.put('updateContest', data);
export const setNewOffer = data => http.post('setNewOffer', data);
export const setOfferStatus = data => http.put('setOfferStatus', data);
export const payMent = data => http.put('pay', data.formData);
export const changeMark = data => http.put('changeMark', data);
export const getPreviewChat = () => http.get('getPreview');
export const getDialog = data =>
  http.get('getChat', {
    params: data,
  });
export const dataForContest = data =>
  http.get('dataForContest', {
    params: data,
  });
export const cashOut = data => http.put('cashout', data);
export const updateUser = data => http.put('updateUser', data);
export const newMessage = data => http.post('newMessage', data);
export const changeChatFavorite = data => http.put('favorite', data);
export const changeChatBlock = data => http.put('blackList', data);
export const getCatalogList = () => http.get('getCatalogs');
export const addChatToCatalog = data => http.post('addNewChatToCatalog', data);
export const createCatalog = data => http.post('createCatalog', data);
export const deleteCatalog = data =>
  http.delete('deleteCatalog', {
    params: data,
  });
export const removeChatFromCatalog = data =>
  http.delete('removeChatFromCatalog', {
    params: data,
  });
export const changeCatalogName = data => http.put('updateNameCatalog', data);
export const getCustomersContests = data =>
  http.get('getCustomersContests', {
    params: {
      limit: data.limit,
      offset: data.offset,
      status: data.contestStatus,
    },
  });
export const getOffers = (moderatedStatus, limit, offset) =>
  http.get(
    `offers?moderatedStatus=${moderatedStatus}&&limit=${limit}&&offset=${offset}`
  );
export const updateOffer = (
  offerId,
  isModerated,
  moderatedStatus,
  limit,
  offset
) =>
  http.put(
    `offers?moderatedStatus=${moderatedStatus}&&limit=${limit}&&offset=${offset}`,
    { offerId, isModerated }
  );
export const getActiveContests = ({
  offset,
  limit,
  typeIndex,
  contestId,
  industry,
  awardSort,
  ownEntries,
}) =>
  http.post('getAllContests', {
    offset,
    limit,
    typeIndex,
    contestId,
    industry,
    awardSort,
    ownEntries,
  });

export const getContestById = data =>
  http.get('getContestById', {
    headers: {
      contestId: data.contestId,
    },
  });
