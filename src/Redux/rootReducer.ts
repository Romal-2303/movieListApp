// import library components
import { combineReducers } from "@reduxjs/toolkit";
import movieDataReducer from "./Slices/MovieList/getMovieData.slice.ts";
import genreListReducer from "./Slices/GenreList/getGenreList.slice.ts";
import movieDetailsReducer from "./Slices/MovieDesc/getMovieDetails.slice.ts";
import movieCreditsReducer from "./Slices/MovieCredits/getMovieCredits.slice.ts";
import filterDataSlice from "./Slices/filterSlice/filter.slice.ts";

export const rootReducer = combineReducers({
  movieDataReducer,
  genreListReducer,
  movieDetailsReducer,
  movieCreditsReducer,
  filterDataSlice,
});
