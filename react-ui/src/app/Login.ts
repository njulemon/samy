import {createSlice} from "@reduxjs/toolkit";


export const isLoggedSlice = createSlice({
    name: 'isLogged',
    initialState: {
        value: false,
    },
    reducers: {
        giveAccess: (state) => {state.value = true},
        denyAccess: (state) => {state.value = false}
    }
})

export const {giveAccess, denyAccess} = isLoggedSlice.actions
export default isLoggedSlice.reducer