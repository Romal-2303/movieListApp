import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectionState {
  filterData: any;
}

const initialState: SelectionState = {
  filterData: null,
};

const filterDataSlice = createSlice({
  name: "filterDataSlice",
  initialState,
  reducers: {
    setFilterData: (state, action: PayloadAction<any>) => {
      state.filterData = action.payload;
    },
  },
});

export const { setFilterData } = filterDataSlice.actions;
export default filterDataSlice.reducer;
// Get awards
