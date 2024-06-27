import axios from "axios";

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// CREATE SONG 
export const createSong = (params) => async (dispatch, getState) => {
    try {
        const {
            url, 
            description, 
            genre  
        } = params;

        // Récupérer le authToken depuis les cookies 
        const authToken = getCookie('authToken');

        if (!authToken) {
            console.log('No valid token');
            return dispatch({
            type: 'CREATE_SONG_FAIL',
            payload: 'You need to be logged in to add a product to the cart. Please log in or create an account.',
            });
        }

        // Configuration des en-têtes
        const config = {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization' : `Bearer ${authToken}`
        }, 
        widthCredentials: true,
        };

        // Config du body 
        const body = {
           url, 
           description, 
           genre
        };
  
      // Déclenchement de la requete de connexion
      dispatch({ type: 'CREATE_SONG_REQUEST'});
  
      // API de connexion
      const response = await axios.post(`https://youtubetoplaylist-backend.onrender.com/api/v1/songs/create-song`, body, config);

  
      dispatch({
          type: 'CREATE_SONG_SUCCESS',
          payload: response.data
        });
      
  
    } catch (error) {
      dispatch({
          type: 'CREATE_SONG_FAIL',
          payload: error.response && error.response.data ? error.response.data : error.message
      })
    }
  };

// FETCH ALL SONG 
export const allSongs = (params) => async (dispatch,getState) => {
    try {
        // Récupérer le authToken depuis les cookies 
        const authToken = getCookie('authToken');

        if (!authToken) {
            console.log('No valid token');
            return dispatch({
            type: 'FETCH_SONGS_FAILURE',
            payload: 'You need to be logged in to add a product to the cart. Please log in or create an account.',
            });
        }

        // Configuration des en-têtes
        const config = {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization' : `Bearer ${authToken}`
        }, 
        widthCredentials: true,
        };

        // PARAMS 
        const { 
            page,
            title,
            genre,
            artiste,
            sortField,
            sortOrder,
            limit  
        } = params;

      // Get the data from the API
      dispatch({ type: 'FETCH_SONGS_REQUEST' });
      const response = await axios.get(`https://youtubetoplaylist-backend.onrender.com/api/v1/songs/all-songs`, {
            params: { page, title, genre, artiste, sortField, sortOrder, limit },
            ...config,
        });

        console.log('SHOW RESPONSE: ', response.data);
      // Success, return data into action.payload
      dispatch({
        type: 'FETCH_SONGS_SUCCESS',
        payload: response.data,
      });

    } catch (error) {
      // Error, can't return data
      dispatch({
        type: 'FETCH_SONGS_FAILURE',
        payload: error.message,
      });
    }
  };

// REMOVE ONE SONG 
export const removeSong = (id) => async (dispatch, getState) => {
    try {
      // Recuperer authToken depuis les cookies 
     const authToken = getCookie('authToken');
    
     if (!authToken) {
         console.log('No valid token');
         return dispatch({
           type: 'REMOVE_SONG_FAIL',
           payload: 'You need to be logged in to view the cart. Please log in or create an account.',
         });
     }
 
     // Configuration des en-têtes
     const config = {
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${authToken}`
       }
     };

      dispatch({ type: 'REMOVE_SONG_REQUEST' });
      const response = await axios.delete(`https://youtubetoplaylist-backend.onrender.com/api/v1/songs/remove-song/${id}`, config);
      

      dispatch({ 
          type: 'REMOVE_SONG_SUCCESS', 
          payload: response.data
      });
    } catch (error) {
      dispatch({ 
          type: 'REMOVE_SONG_FAIL', 
          payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

// REMOVE ALL SONG
export const clearAllSong = () => async (dispatch, getState) => {
    try {
      // Recuperer authToken depuis les cookies 
      const authToken = getCookie('authToken');
      
      if (!authToken) {
          console.log('No valid token');
          return dispatch({
            type: 'CLEAR_ALL_SONG_FAIL',
            payload: 'You need to be logged in to clear all the song. Please log in or create an account.',
          });
      }
  
      // Configuration des en-têtes
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      };
  
      dispatch({ type: 'CLEAR_ALL_SONG_REQUEST' });
  
      await axios.delete('https://youtubetoplaylist-backend.onrender.com/api/v1/songs/clear', config);
  
      dispatch({ type: 'CLEAR_ALL_SONG__SUCCESS' });
  
    } catch (error) {
      dispatch({
        type: 'CLEAR_ALL_SONG_FAIL',
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
  };