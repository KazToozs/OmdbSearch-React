
import { configureStore, Action } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import rootReducer, { RootState } from './rootReducer'

/* 
** The AppThunk type declares that the "action" that we're using is specifically a thunk function. The thunk is customized with some additional type parameters:
**
** -Return value: the thunk doesn't return anything
** -State type for getState: returns our RootState type
** -"Extra argument": the thunk middleware can be customized to pass in an extra value, but we aren't doing that in this app
** -Action types accepted by dispatch: any action whose type is a string.
*/
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

const store = configureStore({
  reducer: rootReducer
})

// if (process.env.NODE_ENV === 'development' && module.hot) {
//   module.hot.accept('./rootReducer', () => {
//     const newRootReducer = require('./rootReducer').default
//     store.replaceReducer(newRootReducer)
//   })
// }

export type AppDispatch = typeof store.dispatch

export default store