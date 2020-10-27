import React, { Dispatch, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { ListItemText } from '@material-ui/core';
import { Provider, useDispatch, useSelector } from 'react-redux'

import './app.scss';
import { fetchMovieSearchList } from './slices/movieListSlice';
import rootReducer, { RootState } from './rootReducer';
import { createStore, applyMiddleware } from '@reduxjs/toolkit';
import store from './store';
import { MovieSearchResult } from 'custom-project-typings';

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
  */
  searchMovies(search: string, dispatch: Dispatch<any>) {
    // use a dispatch on a reducer from the movieListSlice
    dispatch(fetchMovieSearchList(search))
  }
}

const App: React.FC = () => {
  const omdbObject: Omdb = new Omdb
  const dispatch = useDispatch()

  useEffect(() => {
    omdbObject.searchMovies("test", dispatch)    
  })
  // useSelector to use data from store and subscribe to updates
  const movieList: MovieSearchResult = useSelector(
    (state: RootState) => state.movieList.movieList
  )
  
  return <div className="app">
    <TextField label="Search" margin="normal" variant="outlined"/>
    <List >
      {movieList.map(({imdbId, posterUrl, title, ...rest }) => (
        <ListItem key={imdbId} button {...rest}>
          <ListItemText>{title}</ListItemText>
        </ListItem>
      ))}
    </List>
  </div>;
};

export default AppWrapper;
