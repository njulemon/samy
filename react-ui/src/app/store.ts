import { configureStore } from '@reduxjs/toolkit'
import showNewReportReducer from './Report'
import isLoggedReducer from './Login'

const store = configureStore({
  reducer: {
    showNewReport: showNewReportReducer,
    isLogged: isLoggedReducer
  },
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch