import { createSlice, createAsyncThunk, AsyncThunk } from "@reduxjs/toolkit";
import api from "../../../Api/index.ts";

// initial State

import { initialStateApi } from "../../utils.ts";

type payloadType = {
  sort_by?: string;
  primary_release_year?: number;
  page?: number;
  vote_count_gte?: number;
  with_genres?: string;
};

export const getMovieData: AsyncThunk<any, payloadType, {}> = createAsyncThunk(
  "getMovieData",
  async (
    { sort_by, primary_release_year, page, vote_count_gte, with_genres },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        api.config.getMovieList(
          sort_by,
          primary_release_year,
          page,
          vote_count_gte,
          with_genres
        ),
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

const movieDataReducer = createSlice({
  name: "movieDataReducer",
  initialState: initialStateApi,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getMovieData.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(getMovieData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.response = action.payload;
      })
      .addCase(getMovieData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorResponse = action.error;
      });
  },
});

export default movieDataReducer.reducer;
