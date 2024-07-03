// import library components
import { createSelector } from "reselect";
import { RootState } from "../../store";

// create base selector for reducer
const selectMovieCeditsStore = (state: RootState) => state.movieCreditsReducer;

export const selectMovieCreditsResponse = createSelector(
  [selectMovieCeditsStore],
  (selectMovieCeditsStore) => selectMovieCeditsStore.response
);
