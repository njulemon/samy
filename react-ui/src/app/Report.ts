import {createSlice} from '@reduxjs/toolkit'

export const showNewReportSlice = createSlice({
    name: 'showNewReport',
    initialState: {
        value: false,
    },
    reducers: {
        show: (state) => {state.value = true},
        hide: (state) => {state.value = false}
    }
})

export const {show, hide} = showNewReportSlice.actions
export default showNewReportSlice.reducer