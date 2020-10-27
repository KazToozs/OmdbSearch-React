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
  ** Function to recover movies from API
  ** Takes dispatch as parameter to avoid 'not called in function component' issues 
  ** I'm tryin my best here ¯\_(ツ)_/¯
  ** TODO: Maybe set dispatch as a class attribute and have it set on construction?
  */
  searchMovies(search: string, dispatch: Dispatch<any>) {
    // use a dispatch on a reducer from the movieListSlice
    dispatch(fetchMovieSearchList(search))
  }

  getMovie(id: string, dispatch: Dispatch<any>) {
    // use a dispatch on a reducer from the movieListSlice
    console.log(id)
    dispatch(fetchMovieDetails(id))
  }
}

// TODO: move this into it's own file
interface MovieDetailDialogProps {
  open: boolean,
  movieDetailsState: MovieDetailsState
}
function MovieDetailDialog(props: MovieDetailDialogProps) {
  let info
  if (props.movieDetailsState.movieDetails == null) {
    info = <label>Not loaded yet!</label>
  } else {
    const actors = props.movieDetailsState.movieDetails.actors.map(actor =>
        <label key={actor}>{actor}</label>
        );
    info = <div>
      <label>ID: {props.movieDetailsState.movieDetails.imdb.id}</label>
      <label>Poster: {props.movieDetailsState.movieDetails.poster}</label>
      <label>Title: {props.movieDetailsState.movieDetails.title}</label>
      <label>Type: {props.movieDetailsState.movieDetails.type}</label>
      <label>Year: {props.movieDetailsState.movieDetails.year}</label>
      <label>Synopsis: {props.movieDetailsState.movieDetails.plot}</label>
      <label>Actors: {actors}</label>
    </div>
  }
  return <Dialog open={props.open}>
    <DialogTitle id="simple-dialog-title">Movie Details</DialogTitle>
    {props.movieDetailsState.loading === 'pending' ? <CircularProgress size={68} /> : 
    props.movieDetailsState.loading === 'success' ? info : <label>Failed to load info!</label>}

  </Dialog>
}

const App: React.FC = () => {
  const omdbObject: Omdb = new Omdb
  const dispatch = useDispatch()

  // useSelector to use data from store and subscribe to updates
  const movieListState: MovieListState = useSelector(
    (state: RootState) => state.movieList
  )

  const movieDetailsState: MovieDetailsState = useSelector(
    (state: RootState) => state.movieDetails
  )

  const [searchString, setSearchString] = useState("")

  // useEffect(() => {
  //   omdbObject.searchMovies("test", dispatch)    
  // }, [])
  
  function handleSearchOnChange(event) {
    dispatch(getMovieSearchListStarted)
    omdbObject.searchMovies(event.target.value, dispatch)
    setSearchString(event.target.value)
  }

  function handleItemClick(id: string) {
    dispatch(setOpen())
    dispatch(getMovieDetailsStarted)
    omdbObject.getMovie(id, dispatch)
  }
  
  return <div className="app">
    <TextField label="Search" margin="normal" variant="outlined" value={searchString} onChange={handleSearchOnChange}/>
    {movieListState.loading === "pending" ? <CircularProgress size={68} /> : 
    movieListState.loading === "failed" ? <label>Failed to load list: {movieListState.error}</label> : 
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
