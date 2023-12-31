import { createSlice } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';
import { decorateAsyncThunk, pendingReducer } from '../../utils/store';

const OFFERS_SLICE_NAME = 'offers';

const initialState = {
  isFetching: true,
  error: null,
  offers: [],
};

export const getOffers = decorateAsyncThunk({
  key: `${OFFERS_SLICE_NAME}/getOffers`,
  thunk: async ({ moderatedStatus, limit, offset }) => {
    const { data } = await restController.getOffers(
      moderatedStatus,
      limit,
      offset
    );
    return data;
  },
});

export const updateOffer = decorateAsyncThunk({
  key: `${OFFERS_SLICE_NAME}/updateOffer`,
  thunk: async ({ offerId, isModerated, moderatedStatus, limit, offset }) => {
    const { data } = await restController.updateOffer(
      offerId,
      isModerated,
      moderatedStatus,
      limit,
      offset
    );
    return data;
  },
});

const reducers = {
  clearOffersList: state => {
    state.error = null;
    state.offers = [];
  },
};

const extraReducers = builder => {
  builder.addCase(getOffers.pending, pendingReducer);
  builder.addCase(getOffers.fulfilled, (state, { payload }) => {
    state.isFetching = false;
    state.offers = [...payload];
  });
  builder.addCase(getOffers.rejected, (state, { payload }) => {
    state.isFetching = false;
    state.error = payload;
    state.offers = [];
  });
  builder.addCase(updateOffer.pending, pendingReducer);
  builder.addCase(updateOffer.fulfilled, (state, { payload }) => {
    state.isFetching = false;
    const offerIndexToRemove = state.offers.findIndex(
      offer => offer.id === payload.offerId
    );
    if (offerIndexToRemove !== -1) {
      state.offers.splice(offerIndexToRemove, 1);
    }
    payload.newOffer && state.offers.push(payload.newOffer);
  });
  builder.addCase(updateOffer.rejected, (state, { payload }) => {
    state.isFetching = false;
    state.error = payload;
    state.offers = [];
  });
};

const offersSlice = createSlice({
  name: OFFERS_SLICE_NAME,
  initialState,
  reducers,
  extraReducers,
});

const { actions, reducer } = offersSlice;

export const { clearOffersList } = actions;

export default reducer;
