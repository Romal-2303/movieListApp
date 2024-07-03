import { createSlice, createAsyncThunk, AsyncThunk } from "@reduxjs/toolkit";
import api from "../../../Api/index.ts";

// initial State

import { initialStateApi } from "../../utils.ts";

type payloadType = {
  id: number;
};

export const getMovieDetailsAction: AsyncThunk<any, payloadType, {}> =
  createAsyncThunk(
    "getMovieDetailsAction",
    async ({ id }, { rejectWithValue }) => {
      try {
        const response = await fetch(
          api.config.getMovieDetails(id),
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

const movieDetailsReducer = createSlice({
  name: "movieDetailsReducer",
  initialState: initialStateApi,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getMovieDetailsAction.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(getMovieDetailsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.response = action.payload;
      })
      .addCase(getMovieDetailsAction.rejected, (state, action) => {
        state.isLoading = false;
        state.errorResponse = action.error;
      });
  },
});

export default movieDetailsReducer.reducer;
