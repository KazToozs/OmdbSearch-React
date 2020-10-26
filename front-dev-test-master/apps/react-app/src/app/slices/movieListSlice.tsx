import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, MovieSearchResult } from 'custom-project-typings';
import { AppThunk } from '../store';

const API_URL = 'http://www.omdbapi.com/?';
const API_KEY = '&apikey=23aaa32';

interface MovieListState {
  movieList: MovieSearchResult;
  loading: 'idle' | 'pending' | 'success' | 'failed';
}

const initialMovieListState: MovieListState = {
  movieList: [],
  loading: 'idle',
};

const movieListSlice = createSlice({
  name: 'movieList',
  initialState: initialMovieListState,
  reducers: {
    getMovieListSuccess(state, action: PayloadAction<MovieSearchResult>) {
      // Need to convert data to Movie format
      state.movieList = action.payload;
      state.loading = 'success';
    },
    getMovieListFailed(state, action: PayloadAction<string>) {
      state.movieList = [];
      state.loading = 'failed';
    },
  },
  // Must use 'builder' notation here due to TypeScript not liking 'lookup table', standard notations
  // extraReducers: builder => {
  //   builder.addCase(fetchMovieList.fulfilled, (state, action) => {
  //     // TODO: handle json movie objects correctly
  //     // TODO: handle failure state
  //     if (action.payload.ok) {
  //       state.movieList.push(action.payload.json())
  //       state.loading = 'success'
  //     }

  //   })
  //   builder.addCase(fetchMovieList.pending, (state, action) {
  //     // TODO: set loader to pending
  //     state.loading = 'pending'
  //   })
  // }
});

// const fetchMovieList = createAsyncThunk(
//   'movieList/fetchList',
//   async (search: string) => {
//     const searchParam = "&s" + search;
//     const response = await fetch(API_URL + API_KEY + searchParam)
//     if (response.ok) {
//       try {
//         const data = await response.json()
//         return data
//       } catch (error) {
//         console.log('JSON error')
//         return (error);
//       }
//     } else {
//       return ("Error in fetch response: " + response.status)
//     }
//   }
// )

export const {
  getMovieListSuccess,
  getMovieListFailed,
} = movieListSlice.actions;

/*
** more on async thunks here https://redux-toolkit.js.org/usage/usage-with-typescript#createasyncthunk
** Here I copied the 'AppThunk' type as it applies to our purposes and is common: 
** https://redux-toolkit.js.org/tutorials/advanced-tutorial#logic-for-fetching-github-repo-details
*/
export const fetchMovieList = (search: string): AppThunk => async (
  dispatch // ,getState -> to access state data in the thunk before executing an action function (see more above)  
) => {
  const searchParam = '&s' + search;
  // Declare data here so it's usable by Success dispatch...
  let data;
  try {
    const response = await fetch(API_URL + API_KEY + searchParam);
    data = await response.json();
  } catch (err) {
    dispatch(getMovieListFailed(err.toString()));
    return;
  }
  // ... Success dispatch placed here so error's do not result in uncalled-for catch
  console.log('Success, data: ' + data);
  dispatch(getMovieListSuccess(data));
};

export default movieListSlice.reducer;