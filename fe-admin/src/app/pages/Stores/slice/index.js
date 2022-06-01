import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { storesSaga } from './saga';

export const initialState = {
  stores: [],
  pagination: {
    page: 1,
    total: 0,
  },
};

const slice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    getStoresList(state, action) {},
    getStoresListDone(state, action) {
      state.stores = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    getStoresListError(state, action) {
      state.stores = [];
      state.pagination = {};
    },
  },
});

export const { actions: storesActions } = slice;

export const useStoresSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: storesSaga });
  return { actions: slice.actions };
};
