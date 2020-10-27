import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, MovieDetailed, MovieSearchResult } from 'custom-project-typings';
import { AppThunk } from '../store';
import durableJsonLint from 'durable-json-lint'

const API_URL = 'http://www.omdbapi.com/?';
const API_KEY = '&apikey=23aaa32';

export interface MovieDetailsState {
    open: boolean;
    movieDetails: MovieDetailed;
    loading: 'idle' | 'pending' | 'success' | 'failed';
}

const initialState: MovieDetailsState = { 
    open: false, 
    movieDetails: null, 
    loading: 'idle'
}

const movieDetailsSlice = createSlice({
  name: 'movieDetails',
  initialState: initialState,
  reducers: {
    setOpen(state, action: PayloadAction<boolean>) {
        // TODO: make this depend  on payload
      // Need to convert data to Movie format
      state.open = !state.open
      console.log(state.open)
    },
    getMovieDetailsSuccess(state, action: PayloadAction<MovieDetailed>) {
      state.movieDetails = action.payload;
      console.log(state.movieDetails)
      state.loading = 'success';
    },
    getMovieDetailsFailed(state, action: PayloadAction<string>) {
        // TODO: set loading banner based on failure to load
        state.movieDetails = null
        state.loading = 'failed'
    }
  },
});

export const {
    getMovieDetailsSuccess,
    getMovieDetailsFailed,
} = movieDetailsSlice.actions;

// TODO: Maybe move the following formatting functions to Omdb class for cleaner code
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

function formatRuntime(raw) {
    var hours, minutes;

    if (!raw) {
        return null;
    }

    hours = raw.match(/(\d+) h/);
    minutes = raw.match(/(\d+) min/);

    hours = hours ? hours[1] : 0;
    minutes = minutes ? +minutes[1] : 0;

    return (hours * 60) + minutes;
}

function formatList(raw) {
    var list;

    if (!raw) {
        return [];
    }

    list = raw.replace(/\(.+?\)/g, '').split(', ');
    list = list.map(function (item) {
        return item.trim();
    });

    return list;
}

function formatVotes(raw) {
    return raw ? +raw.match(/\d/g).join('') : null;
}

function formatAwards(raw) {
    var wins, nominations;

    if (!raw) {
        return { wins: 0, nominations: 0, text: '' };
    }

    wins = raw.match(/(\d+) wins?/i);
    nominations = raw.match(/(\d+) nominations?/i);

    return {
        wins: wins ? +wins[1] : 0,
        nominations: nominations ? +nominations[1] : 0,
        text: raw
    };
}

/*
** more on async thunks here https://redux-toolkit.js.org/usage/usage-with-typescript#createasyncthunk
** Here I copied the 'AppThunk' type as it applies to our purposes and is common: 
** https://redux-toolkit.js.org/tutorials/advanced-tutorial#logic-for-fetching-github-repo-details
*/

// TODO: make this take a JSON object and not 'any'
function makeMovieDetailedFromJson(movie: any) {
    return {
        title: movie.Title,
        year: formatYear(movie.Year),
        rated: movie.Rated,
      
        season: movie.Season ? +movie.Season : null,
        episode: movie.Episode ? +movie.Episode : null,
        totalSeasons: movie.totalSeasons ? + movie.totalSeasons : null,
      
        // Cast the API's release date as a native JavaScript Date type.
        released: movie.Released ? new Date(movie.Released) : null,
      
        // Return runtime as minutes casted as a Number instead of an
        // arbitrary string.
        runtime: formatRuntime(movie.Runtime),
      
        countries: formatList(movie.Country),
        genres: formatList(movie.Genre),
        director: movie.Director,
        writers: formatList(movie.Writer),
        actors: formatList(movie.Actors),
        plot: movie.Plot,
      
        // A hotlink to a JPG of the movie poster on IMDB.
        poster: movie.Poster,
      
        imdb: {
            id: movie.imdbID,
            rating: movie.imdbRating ? +movie.imdbRating : null,
            votes: formatVotes(movie.imdbVotes)
        },
      
        metacritic: movie.Metascore ? +movie.Metascore : null,
      
        awards: formatAwards(movie.Awards),
      
        type: movie.Type
      }
}

export const fetchMovieDetails = (movieId: string): AppThunk => async (
  dispatch // ,getState -> to access state data in the thunk before executing an action function (see more above)  
) => {
  const searchParam = "&i=" + movieId;
  // Declare data here so it's usable by Success dispatch...
  let jsonData
  try {
    const response = await fetch(API_URL + API_KEY + searchParam);
    // .json() not working, using work around, like here at l.217 https://github.com/misterhat/omdb/blob/master/index.js
    const data = await response.text();
    jsonData = JSON.parse(data)
    console.log(jsonData)

    // API can receive requests that cannot be treated, in which case it returns "{"Response":"False","Error":"Error blah blah"}"
    // This must be handled here
    if (jsonData.Response === 'False')
      throw 'API Input error, recieved: ' + jsonData.Error
      
  } catch (err) {
    dispatch(getMovieDetailsFailed(err.toString()));
    return;
  }
  
  let movieDetails = makeMovieDetailedFromJson(jsonData)
  // ... Success dispatch placed here so error's do not result in uncalled-for catch
  dispatch(getMovieDetailsSuccess(movieDetails));
};

export const { setOpen } = movieDetailsSlice.actions
export default movieDetailsSlice.reducer;



