// store/features/loaderSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'loader',
  initialState: { visible: false, route: '' },
  reducers: {
    showLoader: (state, action) => {
      state.visible = true;
      state.route = action.payload || '';
    },
    hideLoader: (state) => {
      state.visible = false;
      state.route = '';
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
 