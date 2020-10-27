import React, { Dispatch, useEffect, useState } from 'react';
import { Dialog, DialogTitle, TextField } from '@material-ui/core';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { ListItemText } from '@material-ui/core';
import { Provider, useDispatch, useSelector } from 'react-redux'

import './app.scss';
import { fetchMovieSearchList } from './slices/movieListSlice';
import { fetchMovieDetails, MovieDetailsState } from './slices/movieDetailsSlice';
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
  movieDetails: MovieDetailed
}
function MovieDetailDialog(props: MovieDetailDialogProps) {
  let info
  if (props.movieDetails == null) {
    info = <label>Not loaded yet!</label>
  } else {
    const actors = props.movieDetails.actors.map(actor =>
        <label key={actor}>{actor}</label>
        );
      console.log(actors)
    info = <div>
      <label>ID: {props.movieDetails.imdb.id}</label>
      <label>Poster: {props.movieDetails.poster}</label>
      <label>Title: {props.movieDetails.title}</label>
      <label>Type: {props.movieDetails.type}</label>
      <label>Year: {props.movieDetails.year}</label>
      <label>Synopsis: {props.movieDetails.plot}</label>
      <label>Actors: {actors}</label>
    </div>
  }
  return <Dialog open={props.open}>
    <DialogTitle id="simple-dialog-title">Movie Details</DialogTitle>
    {info}

  </Dialog>
}

const App: React.FC = () => {
  const omdbObject: Omdb = new Omdb
  const dispatch = useDispatch()

  // useSelector to use data from store and subscribe to updates
  const movieList: MovieSearchResult = useSelector(
    (state: RootState) => state.movieList.movieList
  )

  const movieDetails: MovieDetailsState = useSelector(
    (state: RootState) => state.movieDetails
  )

  const [searchString, setSearchString] = useState("")

  useEffect(() => {
    omdbObject.searchMovies("test", dispatch)    
  }, [])
  
  function handleSearchOnChange(event) {
    omdbObject.searchMovies(event.target.value, dispatch)
    setSearchString(event.target.value)
  }

  function handleItemClick(id: string) {
    dispatch(setOpen())
    omdbObject.getMovie(id, dispatch)
  }
  
  return <div className="app">
    <TextField label="Search" margin="normal" variant="outlined" value={searchString} onChange={handleSearchOnChange}/>
    <List >
      {movieList.map(({imdbId, posterUrl, title, ...rest }) => (
        <ListItem key={imdbId} button onClick={() => handleItemClick(imdbId)}>
          <ListItemText>{title}</ListItemText>
          <MovieDetailDialog open={movieDetails.open} movieDetails={movieDetails.movieDetails}/>
        </ListItem>
      ))}
    </List>
  </div>;
};

export default AppWrapper;
