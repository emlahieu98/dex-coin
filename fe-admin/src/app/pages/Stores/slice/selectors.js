import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.stores || initialState;

export const selectStores = createSelector(
  [selectSlice],
  state => state.stores,
);
export const selectPagination = createSelector(
  [selectSlice],
  state => state.pagination,
);
