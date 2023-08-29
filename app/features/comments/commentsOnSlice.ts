import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CommentsOnState {
  value: boolean;
}

const initialState: CommentsOnState = {
  value: true,
};

const commentsOnSlice = createSlice({
  name: 'commentsOn',
  initialState,
  reducers: {
    toggleCommentsOn: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggleCommentsOn } = commentsOnSlice.actions;
export default commentsOnSlice.reducer;
