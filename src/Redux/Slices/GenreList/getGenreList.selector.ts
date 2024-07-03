// import library components
import { createSelector } from "reselect";
import { RootState } from "../../store";

// create base selector for reducer
const selectGenreListStore = (state: RootState) => state.genreListReducer;

export const selectGenreListResponse = createSelector(
  [selectGenreListStore],
  (selectGenreListStore) => selectGenreListStore.response
);
