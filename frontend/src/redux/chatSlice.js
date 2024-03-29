import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chat: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    msgList: (state, action) => {
      state.chat = [...state.chat, action.payload];
    },
  },
});

export const { msgList } = chatSlice.actions;

export default chatSlice.reducer;
