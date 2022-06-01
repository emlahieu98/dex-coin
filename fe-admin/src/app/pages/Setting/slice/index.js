import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { settingSaga } from './saga';

export const initialState = {
  setting: [],
};

const slice = createSlice({
  name: 'setting',
  initialState,
  reducers: {},
});

export const { actions: settingActions } = slice;

export const useSettingSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: settingSaga });
  return { actions: slice.actions };
};
