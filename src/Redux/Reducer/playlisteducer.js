import { createPlaylistConst, addToPlaylistConst, deleteAllPlaylistConst, deletePlaylistConst, fetchAllPlaylistConst } from "../../constantes/playlistConstante";

// ------------------------ CREATE PLAYLIST -----------------------------------------------------

const playlistState = {
    playlist: [],
    loading : false,
    error : null,
}

export const createPlaylistreducer = (state = playlistState, action) => {
    switch (action.type) {
        case createPlaylistConst.CREATE_PLAYLIST_REQUEST:
            return {
                ...state,
                loading: true
            }
        case createPlaylistConst.CREATE_PLAYLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                playlist : action.payload,
            }
        case createPlaylistConst.CREATE_PLAYLIST_FAIL:
            return {
                ...state,
                loading: false,
                error : action.payload,
            }
        default:
            return state
    }
}

// ------------------------ ADD TO PLAYLIST PLAYLIST-----------------------------------------------------
const addToPlaylistState = {
    playlist: [],
    loading : false,
    error : null,
}

export const addToPlaylistReducer = (state = addToPlaylistState, action) => {
    switch (action.type) {
        case addToPlaylistConst.ADD_TO_PLAYLIST_REQUEST:
            return {
                ...state,
                loading: true
            }
        case addToPlaylistConst.ADD_TO_PLAYLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                playlist : action.payload,
            }
        case addToPlaylistConst.ADD_TO_PLAYLIST_FAIL:
            return {
                ...state,
                loading: false,
                error : action.payload,
            }
        default:
            return state
    }
}
// ------------------------ DELETE PLAYLIST -----------------------------------------------------
const removePlaylistState = {
    playlist: [],
    loading : false,
    error : null,
}

export const removePlaylistReducer = (state = removePlaylistState, action) => {
    switch (action.type) {
        case deletePlaylistConst.DELETE_PLAYLIST_REQUEST:
            return {
                ...state,
                loading: true
            }
        case deletePlaylistConst.DELETE_PLAYLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                playlist : action.payload,
            }
        case deletePlaylistConst.DELETE_PLAYLIST_FAIL:
            return {
                ...state,
                loading: false,
                error : action.payload,
            }
        default:
            return state
    }
}
// ------------------------ DELETE ALL PLAYLIST -----------------------------------------------------

const removeAllPlaylistState = {
    playlist: [],
    loading : false,
    error : null,
}

export const removeAllPlaylistReducer = (state = removeAllPlaylistState, action) => {
    switch (action.type) {
        case deleteAllPlaylistConst.DELETE_ALL_PLAYLIST_REQUEST:
            return {
                ...state,
                loading: true
            }
        case deleteAllPlaylistConst.DELETE_ALL_PLAYLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                playlist : action.payload,
            }
        case deleteAllPlaylistConst.DELETE_ALL_PLAYLIST_FAIL:
            return {
                ...state,
                loading: false,
                error : action.payload,
            }
        default:
            return state
    }
}

// ------------------------ FETCH ALL PLAYLIST -----------------------------------------------------

const fetchAllPlaylistState = {
    playlist: [],
    loading : false,
    error : null,
}

export const fetchAllPlaylistReducer = (state = fetchAllPlaylistState, action) => {
    switch (action.type) {
        case fetchAllPlaylistConst.FETCH_ALL_PLAYLIST_REQUEST:
            return {
                ...state,
                loading: true
            }
        case fetchAllPlaylistConst.FETCH_ALL_PLAYLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                playlist : action.payload,
            }
        case fetchAllPlaylistConst.FETCH_ALL_PLAYLIST_FAIL:
            return {
                ...state,
                loading: false,
                error : action.payload,
            }
        default:
            return state
    }
}


// ------------------------ FETCH PLAYLIST DETAILS -----------------------------------------------------

const playlistDetailState = {
    playlist: {},
    loading: false,
    error: null,
  };
  
  export const playlistDetailReducer = (state = playlistDetailState, action) => {
    switch (action.type) {
      case 'FETCH_PLAYLIST_DETAIL_REQUEST':
        return {
          ...state,
          loading: true,
        };
      case 'FETCH_PLAYLIST_DETAIL_SUCCESS':
        return {
          ...state,
          loading: false,
          playlist: action.payload,
        };
      case 'FETCH_PLAYLIST_DETAIL_FAIL':
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };