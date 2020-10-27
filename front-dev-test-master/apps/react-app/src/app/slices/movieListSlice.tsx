import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, MovieSearchResult } from 'custom-project-typings';
import { AppThunk } from '../store';
import durableJsonLint from 'durable-json-lint'

const API_URL = 'http://www.omdbapi.com/?';
const API_KEY = '&apikey=23aaa32';

export interface MovieListState {
  movieList: MovieSearchResult;
  loading: 'idle' | 'pending' | 'success' | 'failed';
  error: string;
}

const initialMovieListState: MovieListState = {
  movieList: [],
  loading: 'idle',
  error: null
};

const movieListSlice = createSlice({
  name: 'movieList',
  initialState: initialMovieListState,
  reducers: {
    getMovieSearchListStarted(state) {
      state.movieList = [];
      state.loading = 'pending'
  },
    getMovieSearchListSuccess(state, action: PayloadAction<MovieSearchResult>) {
      // Need to convert data to Movie format
      state.movieList = action.payload;
      state.loading = 'success';
    },
    getMovieSearchListFailed(state, action: PayloadAction<string>) {
      // TODO: set loading banner based on failure to load
      state.movieList = [];
      state.loading = 'failed';
      state.error = action.payload
    },
  },
});

export const {
  getMovieSearchListStarted,
  getMovieSearchListSuccess,
  getMovieSearchListFailed,
} = movieListSlice.actions;

// Copied from https://github.com/misterhat/omdb/blob/master/index.js
// No point reinventing the wheel ¯\_(ツ)_/¯
// Worth having another pass to make TS friendly...
// Maybe transpose to Omdb class?
function formatYear(year) {
  var from, to;
  year = year.split('–');

  if (year.length === 2) {
      from = +year[0];

      if (year[1]) {
          to = +year[1];
      }
      return { from: from, to: to };
  }
  return +year;
}

/*
** more on async thunks here https://redux-toolkit.js.org/usage/usage-with-typescript#createasyncthunk
** Here I copied the 'AppThunk' type as it applies to our purposes and is common: 
** https://redux-toolkit.js.org/tutorials/advanced-tutorial#logic-for-fetching-github-repo-details
*/
export const fetchMovieSearchList = (search: string): AppThunk => async (
  dispatch // ,getState -> to access state data in the thunk before executing an action function (see more above)  
) => {
  const searchParam = "&s=" + search;
  // Declare data here so it's usable by Success dispatch...
  let jsonData
  try {
    const response = await fetch(API_URL + API_KEY + searchParam);
    // .json() not working, using work around, like here at l.217 https://github.com/misterhat/omdb/blob/master/index.js
    const data = await response.text();
    jsonData = JSON.parse(data)

    // API can receive requests that cannot be treated, in which case it returns "{"Response":"False","Error":"Error blah blah"}"
    // This must be handled here
    if (jsonData.Response === 'False')
      throw 'API Input error, received: ' + jsonData.Error

  } catch (err) {
    dispatch(getMovieSearchListFailed(err.toString()));
    return;
  }
  
  let movieSearchResults = jsonData.Search.map(function (movie) {
    return {
        title: movie.Title,
        year: formatYear(movie.Year),
        imdbId: movie.imdbID,
        type: movie.Type,
        posterUrl: movie.Poster
    };
  })
  // ... Success dispatch placed here so error's do not result in uncalled-for catch
  dispatch(getMovieSearchListSuccess(movieSearchResults));
};

export default movieListSlice.reducer;

