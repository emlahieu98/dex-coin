import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { globalSaga } from './saga';
import { GlobalState } from './types';
import { getTokenFromStorage } from '../utils';

export const initialState: GlobalState = {
  accessToken: getTokenFromStorage()?.access_token || '',
  tokens: getTokenFromStorage() || {},
  userInfo: {},
  breadcrumb: {},
  progress: {},
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setDataBreadcrumb(state, action: PayloadAction<any>) {
      state.breadcrumb = action.payload;
    },
    setDataProgress(state, action: PayloadAction<any>) {
      state.progress = action.payload;
    },
    changeAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    changeTokens(state, action: PayloadAction<object>) {
      state.tokens = action.payload;
    },
    getUserInfo(state, _action: PayloadAction) {
      state.loading = true;
      state.error = null;
      state.userInfo = {};
    },
    getUserInfoDone(state, action: PayloadAction<object>) {
      const repos = action.payload;
      state.userInfo = repos;
      state.loading = false;
    },
    getUserInfoError(state, action: PayloadAction) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: globalActions } = slice;

export const useGlobalSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: globalSaga });
  return { actions: slice.actions };
};
