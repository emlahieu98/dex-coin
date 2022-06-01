import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.admins || initialState;

export const selectAdmins = createSelector([selectSlice], state => state);

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

export const selectDataRoles = createSelector([selectSlice], state => {
  const dataRoles = state.dataRoles.data;
  return dataRoles;
});
