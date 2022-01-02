import {createSlice} from '@reduxjs/toolkit'

export const formReportSlice = createSlice({
    name: 'formReport',
    initialState: {
        values: {
            user_type: 'NONE_USER_TYPE',
            category_1: 'NONE_CAT_1',
            category_2: 'NONE_CAT_2',
            latitude: 0.0,
            longitude: 0.0
        },
        touched: {
            user_type: false,
            category_1: false,
            category_2: false,
        }
    },
    reducers: {
        setFields: (state, action) => {
            state.values.user_type = action.payload.user_type
            state.values.category_1 = action.payload.category_1
            state.values.category_2 = action.payload.category_2
        },
        setCoordinates: (state, action) => {
            state.values.latitude = action.payload.latitude
            state.values.longitude = action.payload.longitude
        },
        setTouched: (state, action) => {
            state.touched.user_type = action.payload.user_type
            state.touched.category_1 = action.payload.category_1
            state.touched.category_2 = action.payload.category_2
        },
        clear: (state) => {
            state.values.user_type = 'NONE_USER_TYPE'
            state.values.category_1 = 'NONE_CAT_1'
            state.values.category_2 = 'NONE_CAT_2'
            state.values.latitude = 0.0
            state.values.longitude = 0.0
        }
    }
})

export const {setFields, setCoordinates, setTouched, clear} = formReportSlice.actions
export default formReportSlice.reducer