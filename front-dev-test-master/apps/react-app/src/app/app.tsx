import React from 'react';
import { TextField } from '@material-ui/core';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { ListItemText } from '@material-ui/core';
import { Provider, useDispatch, useSelector } from 'react-redux'

import './app.scss';
import { fetchMovieList } from './slices/movieListSlice';
import rootReducer, { RootState } from './rootReducer';
import { createStore, applyMiddleware } from '@reduxjs/toolkit';
import store from './store';

class Omdb {
  // Function to recover movies from API
  getMovies(search: string) {
    // use a dispatch on a reducer from the movieListSlice
    const dispatch = useDispatch()
    dispatch(fetchMovieList(search))
  }
}

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

const App: React.FC = () => {
  let omdbObject: Omdb = new Omdb
  // useSelector to use data from store and subscribe to updates
  const movieList = useSelector(
    (state: RootState) => state.movieList
  )
  omdbObject.getMovies("test")

  return <div className="app">
    <TextField label="Search" margin="normal" variant="outlined"/>
    {/* <List >
      {omdbObject.movies.map(({imdbId, posterUrl, title, ...rest }) => (
        <ListItem key={imdbId} button {...rest}>
          <ListItemText>{title}</ListItemText>
        </ListItem>
      ))}
    </List> */}
  </div>;
};

export default AppWrapper;
