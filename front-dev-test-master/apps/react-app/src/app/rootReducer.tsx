import { combineReducers } from '@reduxjs/toolkit'
import  movieListReducer from './slices/movieListSlice'

const rootReducer = combineReducers({
    movieList: movieListReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer