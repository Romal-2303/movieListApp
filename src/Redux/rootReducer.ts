// import library components
import { combineReducers } from "@reduxjs/toolkit";
import movieDataReducer from "./Slices/MovieList/getMovieData.slice.ts";
import genreListReducer from "./Slices/GenreList/getGenreList.slice.ts";

export const rootReducer = combineReducers({
  movieDataReducer,
  genreListReducer,
});
