import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { productsSaga } from './saga';
import { ProductsState } from './types';

export const initialState: ProductsState = {
  loading: false,
  detail: {},
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
};

const slice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getData(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDone(state, action: PayloadAction) {
      const repos = action.payload;
      state.data = repos;
      state.loading = false;
    },
    getError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    getDetail(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDetailDone(state, action: PayloadAction) {
      const detail = action.payload;
      state.detail = detail;
      state.loading = false;
    },
    getDetailError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    update(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    updateDone(state, _action: PayloadAction) {
      state.loading = false;
    },
    updateError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: productsActions } = slice;

export const useProductsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: productsSaga });
  return { actions: slice.actions };
};
