import { createSongConst, fetchAllSongConst, clearAllSongConst, removeSongConst } from "../../constantes/songConstante"

// ------------------------ CREATE SONG -----------------------------------------------------

const songState = {
    song: [],
    loading : false,
    error : null,
}

export const createSongReducer = (state = songState, action) => {
    switch (action.type) {
        case createSongConst.CREATE_SONG_REQUEST:
            return {
                ...state,
                loading: true
            }
        case createSongConst.CREATE_SONG_SUCCESS:
            return {
                ...state,
                loading: false,
                song : action.payload,
            }
        case createSongConst.CREATE_SONG_FAIL:
            return {
                ...state,
                loading: false,
                error : action.payload,
            }
        default:
            return state
    }
}

// ------------------------ FETCH ALL SONG -----------------------------------------------------
const allSongsState = {
    song: [],
    loading : false,
    error : null,
}

export const fetchAllSongReducer = (state = allSongsState, action) => {
    switch (action.type) {
        case fetchAllSongConst.FETCH_SONG_REQUEST:
            return {
                ...state,
                loading: true
            }
        case fetchAllSongConst.FETCH_SONG_SUCCESS:
            return {
                ...state,
                loading: false,
                song: action.payload,
            }
        case fetchAllSongConst.FETCH_SONG_FAIL:
            return {
                ...state,
                loading: false,
                error : action.payload,
            }
        default:
            return state
    }
}
// ------------------------ RELOVE ONE SONG -----------------------------------------------------
const removeSongState = {
    song: [],
    loading : false,
    error : null,
}

export const removeSongReducer = (state = removeSongState, action) => {
    switch (action.type) {
        case removeSongConst.REMOVE_SONG_REQUEST:
            return {
                ...state,
                loading: true
            }
        case removeSongConst.REMOVE_SONG_SUCCESS:
            return {
                ...state,
                loading: false,
                song : action.payload,
            }
        case removeSongConst.REMOVE_SONG_FAIL:
            return {
                ...state,
                loading: false,
                error : action.payload,
            }
        default:
            return state
    }
}
// ------------------------ REMOVE ALL SONG -----------------------------------------------------

const removeAllSongState = {
    song: [],
    loading : false,
    error : null,
}

export const removeAllSongReducer = (state = removeAllSongState, action) => {
    switch (action.type) {
        case clearAllSongConst.CLEAR_ALL_SONG_REQUEST:
            return {
                ...state,
                loading: true
            }
        case clearAllSongConst.CLEAR_ALL_SONG__SUCCESS:
            return {
                ...state,
                loading: false,
                song : action.payload,
            }
        case clearAllSongConst.CLEAR_ALL_SONG_FAIL:
            return {
                ...state,
                loading: false,
                error : action.payload,
            }
        default:
            return state
    }
}