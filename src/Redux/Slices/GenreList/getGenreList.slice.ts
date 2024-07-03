// initial State

import { initialStateApi } from "../../utils.ts";
import { createAsyncThunk, AsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../Api/index.ts";

type payloadType = {};

export const getGenreListAction: AsyncThunk<any, payloadType, {}> =
  createAsyncThunk("getGenreListAction", async ({}, { rejectWithValue }) => {
    try {
      const response = await fetch(api.config.getGenreList(), api.http.get());

      const result = await api.afterFetchHandlers.parseContent(
        response,
        api.http.get()
      );

      return result;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      rejectWithValue(error);
    }
  });

const genreListReducer = createSlice({
  name: "genreListReducer",
  initialState: initialStateApi,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getGenreListAction.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(getGenreListAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.response = action.payload;
      })
      .addCase(getGenreListAction.rejected, (state, action) => {
        state.isLoading = false;
        state.errorResponse = action.error;
      });
  },
});

export default genreListReducer.reducer;
