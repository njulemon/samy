import {applyMiddleware, configureStore, createStore} from '@reduxjs/toolkit'
import statesReducer from './States'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

const store = configureStore({
    reducer: {
        states: statesReducer
    }
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch