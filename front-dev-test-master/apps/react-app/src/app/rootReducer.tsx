import { combineReducers } from '@reduxjs/toolkit'
import  movieListReducer from './slices/movieListSlice'
import  movieDetailsReducer from './slices/movieDetailsSlice'

const rootReducer = combineReducers({
    movieList: movieListReducer,
    movieDetails: movieDetailsReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer