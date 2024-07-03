// import library components
import { createSelector } from "reselect";
import { RootState } from "../../store";

// create base selector for reducer
const selectMovieDetailsStore = (state: RootState) => state.movieDetailsReducer;

export const selectMovieDetailsResponse = createSelector(
  [selectMovieDetailsStore],
  (selectMovieDetailsStore) => selectMovieDetailsStore.response
);
