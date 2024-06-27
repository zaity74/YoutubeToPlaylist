import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import { userLoginReducer, userRegisterReducer, forgotPasswordReducer } from './Reducer/userReducer';
import { fetchAllSongReducer, createSongReducer, removeSongReducer, removeAllSongReducer } from './Reducer/songReducer';
import { createPlaylistreducer, addToPlaylistReducer, playlistDetailReducer, removeAllPlaylistReducer, removePlaylistReducer, fetchAllPlaylistReducer } from './Reducer/playlisteducer';
import { addToHistoryReducer, getUserHistoryReducer } from './Reducer/historyListReducer';
import { fetchPlaylistDetail } from './Actions/playlistActions';

const rootReducer = combineReducers({
  // USER 
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    forgotPassword : forgotPasswordReducer,
  
  // SONG 
  createSong : createSongReducer, 
  fetchAllSong : fetchAllSongReducer, 
  removeSong : removeSongReducer, 
  removeAllSong : removeAllSongReducer, 

  // PLAYLIST
  createPlaylist : createPlaylistreducer, 
  addToPlaylist : addToPlaylistReducer, 
  removePlaylist : removePlaylistReducer, 
  fetchAllPlaylist : fetchAllPlaylistReducer,
  fetchPlaylistDetail : playlistDetailReducer,

  // HISTORY 
  addToHistory : addToHistoryReducer, 
  getUserHistory : getUserHistoryReducer,

});

/* INITIAL STATE */
const initialState = {};

const configureAppStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
};

export default configureAppStore;
