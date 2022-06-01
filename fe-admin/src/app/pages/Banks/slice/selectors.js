import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.banks || initialState;

export const selectBanks = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectData = createSelector([selectSlice], state => {
  const data = state.data.data;
  return data;
});
export const selectPagination = createSelector(
  [selectSlice],
  state => state.data.pagination,
);
export const selectDetail = createSelector(
  [selectSlice],
  state => state.detail.data,
);
