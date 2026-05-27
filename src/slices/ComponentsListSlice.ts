import { createSlice } from '@reduxjs/toolkit';

interface FiltersState {
  searchValue: string;
  typeFilter: string;
  appliedSearch: string;
  selectedImage: string | null;
}

const initialState: FiltersState = {
  searchValue: '',
  typeFilter: '',
  appliedSearch: '',
  selectedImage: null,
};

const filtersSlice = createSlice({
  name: 'filters',

  initialState,

  reducers: {
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },

    setAppliedSearch: (state) => {
      state.appliedSearch = state.searchValue;
    },

    setTypeFilter: (state, action) => {
      state.typeFilter = action.payload;
    },

    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
    },

    clearFilters: (state) => {
      state.searchValue = '';
      state.typeFilter = '';
      state.selectedImage = null;
    },
  },
});

export const {
  setSearchValue,
  setTypeFilter,
  setAppliedSearch, 
  setSelectedImage,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;