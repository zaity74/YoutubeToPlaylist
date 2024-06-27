import { addToHistoryConst, getUseHistoryConst } from "../../constantes/historyConstante";

// ------------------------ ADD TO HISTORY -----------------------------------------------------

const addToHistoryState = {
    history: [],
    loading : false,
    error : null,
}

export const addToHistoryReducer = (state = addToHistoryState, action) => {
    switch (action.type) {
        case addToHistoryConst.ADD_TO_HISTORY_REQUEST:
            return {
                ...state,
                loading: true
            }
        case addToHistoryConst.ADD_TO_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                history : action.payload,
            }
        case addToHistoryConst.ADD_TO_HISTORY_FAIL:
            return {
                ...state,
                loading: false,
                error : action.payload,
            }
        default:
            return state
    }
}

// ------------------------ GET USER HISTORY -----------------------------------------------------
const getUserHistoryState = {
    history: [],
    loading : false,
    error : null,
}

export const getUserHistoryReducer = (state = getUserHistoryState, action) => {
    switch (action.type) {
        case getUseHistoryConst.FETCH_HISTORY_REQUEST:
            return {
                ...state,
                loading: true
            }
        case getUseHistoryConst.FETCH_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                history : action.payload,
            }
        case getUseHistoryConst.FETCH_HISTORY_FAIL:
            return {
                ...state,
                loading: false,
                error : action.payload,
            }
        default:
            return state
    }
}