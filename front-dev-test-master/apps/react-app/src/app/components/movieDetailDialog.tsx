import classes from '*.module.css';
import { CircularProgress, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootReducer';
import { MovieDetailsState, setDialogOpen } from '../slices/movieDetailsSlice';
import './movieDetailDialog.scss'

function MovieDetailDialog() {
  const movieDetailsState: MovieDetailsState = useSelector(
    (state: RootState) => state.movieDetails
  )

  const dispatch = useDispatch()

  // Customising the dialog box style has proven to be somewhat convoluted...
    return <Dialog onBackdropClick={() => dispatch(setDialogOpen(false))}
    PaperProps={{
      style: {
        padding: 10,
      },
    }}
    className="dialogBox"
    open={movieDetailsState.open}>
     <DialogContent style={{ overflow: "hidden" }}>
     <DialogTitle id="simple-dialog-title">Movie Details</DialogTitle>
      {movieDetailsState.loading === 'pending' ? 
      <CircularProgress size={68} /> : 
      movieDetailsState.loading === 'success' ? <>
        <label>IMDB ID:</label>
        <p>{movieDetailsState.movieDetails.imdb.id}</p>
        <label>Title:</label>
        <p>{movieDetailsState.movieDetails.title}</p>
        <label>Type:</label>
        <p>{movieDetailsState.movieDetails.type}</p>
        <label>Year:</label>
        <p>{movieDetailsState.movieDetails.year}</p>
        <label>Synopsis:</label>
        <p>{movieDetailsState.movieDetails.plot}</p>
        <label>Actors:</label>
        <div className="actors">
        {movieDetailsState.movieDetails.actors.map((actor, index) =>
          <p key={index}>{actor}</p>
        )}</div>
      </>
      : <label>Failed to load info!</label>}
     </DialogContent>
      
    </Dialog>
  }

  export default MovieDetailDialog