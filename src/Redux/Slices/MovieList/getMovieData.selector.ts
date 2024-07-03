// import library components
import { createSelector } from "reselect";
import { RootState } from "../../store";

// create base selector for reducer
const selectMovieDataStore = (state: RootState) => state.movieDataReducer;

export const selectMovieDataResponse = createSelector(
  [selectMovieDataStore],
  (selectMovieDataStore) => selectMovieDataStore.response
);
