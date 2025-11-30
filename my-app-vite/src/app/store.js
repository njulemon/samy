import {configureStore} from '@reduxjs/toolkit'
import statesReducer from './States'

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