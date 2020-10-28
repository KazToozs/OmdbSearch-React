import React, { Dispatch, useEffect, useState } from 'react';
import { CircularProgress, Dialog, DialogTitle, TextField } from '@material-ui/core';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { ListItemText } from '@material-ui/core';
import { Provider, useDispatch, useSelector } from 'react-redux'

import './app.scss';
import { fetchMovieSearchList, getMovieSearchListStarted, MovieListState } from './slices/movieListSlice';
import { fetchMovieDetails, getMovieDetailsFailed, getMovieDetailsStarted, MovieDetailsState } from './slices/movieDetailsSlice';
import { setOpen } from './slices/movieDetailsSlice';
import rootReducer, { RootState } from './rootReducer';
import { createStore, applyMiddleware } from '@reduxjs/toolkit';
import store from './store';
import { Movie, MovieDetailed, MovieSearchResult } from 'custom-project-typings';
import MovieDetailDialog from './components/movieDetailDialog';

// I had to dig hard to find that this was supposed to be how the project is set up... 
// https://github.com/reduxjs/rtk-github-issues-example/blob/master/src/index.tsx
export const AppWrapper = () => {
  // const store = createStore(rootReducer, applyMiddleware(thunk));

  return (
    <Provider store={store}> 
      <App /> 
    </Provider>
  )
}

class Omdb {
  /* 
  ** Takes dispatch as parameter to avoid 'not called in function component' issues 
  ** I'm tryin my best here ¯\_(ツ)_/¯
  */
  dispatch: Dispatch<any>;

  constructor(dispatcher: Dispatch<any>) {
    this.dispatch = dispatcher
  }

  searchMovies(search: string) {
    // use a dispatch on a reducer from the movieListSlice
    this.dispatch(fetchMovieSearchList(search))
  }

  getMovie(id: string) {
    // use a dispatch on a reducer from the movieListSlice
    console.log(id)
    this.dispatch(fetchMovieDetails(id))
  }
}

const App: React.FC = () => {
  const dispatch = useDispatch()
  const omdbObject: Omdb = new Omdb(dispatch)

  // useSelector to use data from store and subscribe to updates
  const movieListState: MovieListState = useSelector(
    (state: RootState) => state.movieList
  )

  const movieDetailsState: MovieDetailsState = useSelector(
    (state: RootState) => state.movieDetails
  )

  const [searchString, setSearchString] = useState("")

  function handleSearchOnChange(event) {
    setSearchString(event.target.value)
    dispatch(getMovieSearchListStarted)
    omdbObject.searchMovies(event.target.value)
  }

  function handleItemClick(id: string) {
    console.log(movieDetailsState.open)
    dispatch(setOpen())
    dispatch(getMovieDetailsStarted)
    omdbObject.getMovie(id)
  }
  
  return <div className="app">
    <h1>OMDB Movie Search</h1>
    <TextField label="Search" margin="normal" variant="outlined" value={searchString} onChange={handleSearchOnChange} fullWidth={true}/>
    {movieListState.loading === "pending" ? <CircularProgress size={68} /> : 
    movieListState.loading === "failed" ? <label className="failedBanner">Failed to load list: {movieListState.error}</label> : 
    <List >
      {movieListState.movieList.map(({imdbId, posterUrl, title, ...rest }) => (
        <ListItem key={imdbId} button onClick={() => handleItemClick(imdbId)}>
          <ListItemText>{title}</ListItemText>
          <MovieDetailDialog open={movieDetailsState.open} movieDetailsState={movieDetailsState}/>
        </ListItem>
      ))}
    </List>}
  </div>;
};

export default AppWrapper;
