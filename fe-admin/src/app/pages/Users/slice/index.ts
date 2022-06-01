import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { usersSaga } from './saga';
import { UsersState } from './types';
import { isEmpty } from 'lodash';

export const initialState: UsersState = {
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
  name: 'users',
  initialState,
  reducers: {
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

    updateUser(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDataRoles(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDataRolesDone(state, action: PayloadAction) {
      const repos = action.payload;
      state.dataRoles = repos;
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
  },
});

export const { actions: usersActions } = slice;

export const useUsersSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: usersSaga });
  return { actions: slice.actions };
};
