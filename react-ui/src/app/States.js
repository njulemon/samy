import {createSlice} from '@reduxjs/toolkit'
import axios from "axios";
import {uriGetUser, uriVotes, urlServer} from "../def/Definitions";

export const stateSlice = createSlice({
    name: 'states',
    initialState: {
        modales: {
            modal_new_report: false,
            modal_event_detail: false,
            current_event_id: -1,
            note_mine: null,
            note_mine_id: null,
            notes_other: null,
            n_votes: 0
        },

        isLogged: false,

        reload: false,

        form_report: {
            values: {
                operation: 'LOCALE',
                category_1: 'NONE_CAT_1',
                category_2: 'NONE_CAT_2',
                latitude: 0.0,
                longitude: 0.0,
                picture_pk: null,
                comment: null
            },
            touched: {
                operation: false,
                category_1: false,
                category_2: false,
            }
        },

        translation: {},

        user: {},

        communesGeoJson: null
    },

    reducers: {
        showNewReportModal: (state) => {
            state.modales.modal_new_report = true
        },
        hideNewReportModal: (state) => {
            state.modales.modal_new_report = false
        },
        showReportDetailModal: (state) => {
            state.modales.modal_event_detail = true
        },
        hideReportDetailModal: (state) => {
            state.modales.modal_event_detail = false
        },
        giveAccess: (state) => {
            state.isLogged = true
        },
        denyAccess: (state) => {
            state.isLogged = false
        },
        setNewReportFields: (state, action) => {
            state.form_report.values.operation = action.payload.operation
            state.form_report.values.category_1 = action.payload.category_1
            state.form_report.values.category_2 = action.payload.category_2
        },
        setCoordinatesNewReport: (state, action) => {
            state.form_report.values.latitude = action.payload.latitude
            state.form_report.values.longitude = action.payload.longitude
        },
        setNewReportPicture: (state, action) => {
            state.form_report.values.picture_pk = action.payload.picture_pk
        },
        setNewReportComment: (state, action) => {
            state.form_report.values.comment = action.payload.comment
        },
        setNewReportFormTouched: (state, action) => {
            state.form_report.touched.operation = action.payload.operation
            state.form_report.touched.category_1 = action.payload.category_1
            state.form_report.touched.category_2 = action.payload.category_2
        },
        clearNewReportForm: (state) => {
            state.form_report.values.operation = 'LOCALE'
            state.form_report.values.category_1 = 'NONE_CAT_1'
            state.form_report.values.category_2 = 'NONE_CAT_2'
            state.form_report.values.latitude = 0.0
            state.form_report.values.longitude = 0.0
        },
        setNewReportFormTranslation: (state, action) => {
            state.translation = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setReportDetailNotes: (state, action) => {
            state.modales.notes_other = action.payload.notes_other
            state.modales.note_mine = action.payload.note_mine
            state.modales.n_votes = action.payload.n_votes
            state.modales.note_mine_id = action.payload.note_mine_id
        },
        // reload are use by the map to reload reports after a new one has been added.
        reload: (state) => {
            state.reload = true
        },
        // after reloading, map set back reload to its original value.
        setReloadIsDone: (state) => {
            state.reload = false
        },
        setCommunesGeoJson: (state, action) => {
            state.communesGeoJson = action.payload
        }
    }
})

export const {
    showNewReportModal,
    hideNewReportModal,
    showReportDetailModal,
    hideReportDetailModal,
    giveAccess,
    denyAccess,
    setNewReportFields,
    setCoordinatesNewReport,
    setNewReportComment,
    setNewReportPicture,
    setNewReportFormTouched,
    clearNewReportForm,
    setNewReportFormTranslation,
    setUser,
    setReportDetailNotes,
    reload,
    setReloadIsDone,
    setCommunesGeoJson
} = stateSlice.actions

// ---------------------------------------------//
//      ASYNC REDUCERS (Middleware : Thunk)
// ---------------------------------------------//


export const checkAccessAndGetUser = () => async dispatch => {
    try {
        const response = await axios.get(
            urlServer + uriGetUser,
            {withCredentials: true})
        if (response.status === 200) {
            dispatch(setUser(response.data))
            dispatch(giveAccess())
        } else {
            dispatch(denyAccess())
        }
    } catch (err) {
        dispatch(denyAccess())
    }

}

export function updateNotes(id_report) {
    return async function updateNotesThunk(dispatch, getState) {
        const response = await axios.get(
            urlServer + uriVotes + id_report.toString() + '/',
            {withCredentials: true})
        if (response.status === 200 && response.data !== []) {
            const notes_other = processVotes(response.data)
            const {note_mine, note_mine_id} = getUserVoteInfo(response.data, getState().states.user)
            const n_votes = Object.keys(response.data).length
            dispatch(setReportDetailNotes({
                notes_other: notes_other,
                note_mine: note_mine,
                n_votes: n_votes,
                note_mine_id: note_mine_id
            }))
        }
    }
}

// ---------------//
//      TOOLS
// ---------------//

const getUserVoteInfo = function (data, user) {
    const ownVote = data.filter((vote) => vote.user === user.id)
    if (Object.keys(ownVote).length === 1) {
        return {note_mine: ownVote[0].gravity, note_mine_id: ownVote[0].id}
    } else {
        return {note_mine: null, note_mine_id: null}
    }
}

const processVotes = function (data) {
    if (Object.keys(data).length !== 0) {
        // reduce does not work with one element
        if (Object.keys(data).length === 1)
            return data[0].gravity
        else {
            return (data.reduce((sum, elem) => sum + elem.gravity, 0) / Object.keys(data).length).toFixed(1)
        }
    } else {
        return -1
    }
}

export default stateSlice.reducer