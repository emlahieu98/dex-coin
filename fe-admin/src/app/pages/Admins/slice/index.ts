import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { adminsSaga } from './saga';
import { AdminsState } from './types';

export const initialState: AdminsState = {
  loading: false,
  detail: {},
  dataRoles: {},
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
};

const slice = createSlice({
  name: 'admins',
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

    updateUser(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },

    getDataRoles(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDataRolesDone(state, action: PayloadAction) {
      const dataRoles = action.payload;
      state.dataRoles = dataRoles;
      state.loading = false;
    },
    getDataRolesError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    updateRolesUser(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },

    createAdmin(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    createAdminDone(state, action: PayloadAction) {
      // const repos = action.payload;
      // state.dataRoles = repos;
      state.loading = false;
    },
    createAdminError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: adminsActions } = slice;

export const useAdminsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: adminsSaga });
  return { actions: slice.actions };
};
