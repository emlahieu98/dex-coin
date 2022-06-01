import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.setting || initialState;

export const selectSetting = createSelector(
  [selectSlice],
  state => state.setting,
);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);
