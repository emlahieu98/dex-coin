import { createSlice } from 'utils/@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { notificationsSaga } from './saga';

export const initialState = {
  loading: false,
  showEmptyPage: false,
  isFirst: true,
  details: {},
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  listSelected: [],
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    getData(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    getDone(state, action) {
      const repos = action.payload;
      state.data = repos;
      if (isEmpty(repos.data) && state.isFirst) {
        state.showEmptyPage = true;
      }
      state.isFirst = false;
      state.loading = false;
    },
    getError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    getDetail(state, _action) {
      state.loading = true;
      // state.detail = {};
    },
    getDetailDone(state, action) {
      const detail = action.payload;
      state.detail = detail;
      state.loading = false;
    },
    getDetailError(state, action) {
      // state.error = action.payload;
      if (action.payload.error_code === 'Notification_not_found') {
        state.showEmptyPage = true;
      }
      state.loading = false;
    },

    createNotify(state, _action) {
      state.loading = true;
    },
    createNotifyDone(state, _action) {
      state.loading = false;
    },
    createNotifyError(state) {
      state.loading = false;
    },

    setListSelected(state, action) {
      state.listSelected = action.payload;
    },

    resetWhenLeave(state) {
      state.isFirst = true;
      state.showEmptyPage = false;
    },
    setShowEmptyPage(state, action) {
      // state.error = action.payload;
      state.showEmptyPage = action.payload;
    },
    clearEmptyPage(state) {
      state.showEmptyPage = false;
    },
  },
});

export const { actions: notificationsActions, reducer } = slice;

export const useNotificationSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: notificationsSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useNotificationsSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
