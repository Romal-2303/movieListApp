import { createSlice, createAsyncThunk, AsyncThunk } from "@reduxjs/toolkit";
import api from "../../../Api/index.ts";

// initial State

import { initialStateApi } from "../../utils.ts";

type payloadType = {
  id: number;
};

export const getMovieCreditsAction: AsyncThunk<any, payloadType, {}> =
  createAsyncThunk(
    "getMovieCreditsAction",
    async ({ id }, { rejectWithValue }) => {
      try {
        const response = await fetch(
          api.config.getMovieCredits(id),
          api.http.get()
        );

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
    }
  );

const movieCreditsReducer = createSlice({
  name: "movieCreditsReducer",
  initialState: initialStateApi,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getMovieCreditsAction.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(getMovieCreditsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.response = action.payload;
      })
      .addCase(getMovieCreditsAction.rejected, (state, action) => {
        state.isLoading = false;
        state.errorResponse = action.error;
      });
  },
});

export default movieCreditsReducer.reducer;
