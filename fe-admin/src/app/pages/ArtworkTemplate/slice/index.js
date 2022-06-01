import { createSlice } from 'utils/@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { artworkTemplateSaga } from './saga';

export const initialState = {
  loading: false,
  showEmptyPage: false,
  isFirst: true,
  details: [],
  listStores: [],
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
};

const slice = createSlice({
  name: 'artworkTemplate',
  initialState,
  reducers: {
    setListStores(state, action) {
      state.listStores = action.payload;
    },
    setOrderId(state, action) {
      state.orderId = action.payload;
    },
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
    resetWhenLeave(state) {
      state.isFirst = true;
      state.showEmptyPage = false;
    },
    setShowEmptyPage(state, action) {
      // state.error = action.payload;
      state.showEmptyPage = action.payload;
    },
    updateLists(state, action) {
      const index = state.data.data.findIndex(
        todo => todo.id === action.payload.id,
      );
      state.data.data[index].fulfillment_status = action.payload.status;
    },
    getDetail(state, _action) {
      state.loading = true;
      state.detail = {};
    },
    getDetailDone(state, action) {
      const detail = action.payload.data;
      state.detail = detail;
      state.loading = false;
    },
    getDetailError(state, action) {
      // state.error = action.payload;
      if (action.payload.error_code === 'order_not_found') {
        state.showEmptyPage = true;
      }
      state.loading = false;
    },
    clearEmptyPage(state) {
      state.showEmptyPage = false;
    },
    create(state, action) {
      state.loading = true;
    },
    createDone(state, action) {
      state.loading = false;
    },
    createError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    update(state, action) {
      state.loading = true;
    },
    updateDone(state, action) {
      state.loading = false;
    },
    updateError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: artworkTemplatesActions, reducer } = slice;

export const useArtWorkTemplateSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: artworkTemplateSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useOrdersSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
