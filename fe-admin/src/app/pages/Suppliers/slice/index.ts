import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { suppliersSaga } from './saga';
import { SuppliersState } from './types';
import { isEmpty } from 'lodash';

export const initialState: SuppliersState = {
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
  name: 'suppliers',
  initialState,
  reducers: {
    reload(state, action: PayloadAction) {
      state.data = [];
    },
    getData(state, _action: PayloadAction) {
      state.loading = isEmpty(state.data.data);
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

    TransferStatusSupplier(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    TransferStatusSupplierDetail(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },

    UpdateSupplier(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    UpdateSupplierDetail(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
  },
});

export const { actions: suppliersActions } = slice;

export const useSuppliersSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: suppliersSaga });
  return { actions: slice.actions };
};
