import classes from '*.module.css';
import { CircularProgress, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react';
import { MovieDetailsState } from '../slices/movieDetailsSlice';
import './movieDetailDialog.scss'

interface MovieDetailDialogProps {
    open: boolean;
    movieDetailsState: MovieDetailsState;
  }


function MovieDetailDialog(props: MovieDetailDialogProps) {
  // Customising the dialog box style has proven to be somewhat convoluted...
    return <Dialog 
    PaperProps={{
      style: {
        padding: 10,
      },
    }}
    className="dialogBox"
   open={props.open}>
     <DialogContent style={{ overflow: "hidden" }}>
     <DialogTitle id="simple-dialog-title">Movie Details</DialogTitle>
      {props.movieDetailsState.loading === 'pending' ? 
      <CircularProgress size={68} /> : 
      props.movieDetailsState.loading === 'success' ? <>
        <label>ID:</label>
        <p>{props.movieDetailsState.movieDetails.imdb.id}</p>
        <label>Title:</label>
        <p>{props.movieDetailsState.movieDetails.title}</p>
        <label>Type:</label>
        <p>{props.movieDetailsState.movieDetails.type}</p>
        <label>Year:</label>
        <p>{props.movieDetailsState.movieDetails.year}</p>
        <label>Synopsis:</label>
        <p>{props.movieDetailsState.movieDetails.plot}</p>
        <label>Actors:</label>
        <p>
        {props.movieDetailsState.movieDetails.actors.map((actor) =>
          <> | {actor}</>
        )}</p>
      </>
      : <label>Failed to load info!</label>}
     </DialogContent>
      
    </Dialog>
  }

  export default MovieDetailDialog