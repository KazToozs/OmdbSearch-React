import { CircularProgress, Dialog, DialogTitle } from '@material-ui/core';
import React from 'react';
import { MovieDetailsState } from '../slices/movieDetailsSlice';

interface MovieDetailDialogProps {
    open: boolean;
    movieDetailsState: MovieDetailsState;
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

  export default MovieDetailDialog