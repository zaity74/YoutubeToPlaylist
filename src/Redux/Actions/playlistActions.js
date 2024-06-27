import axios from "axios";

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// ADD TO PLAYLIST
export const addToPlaylist = (id, params) => async (dispatch, getState) => {
    try {

      const { playlistId, songId } = params;
  
      // Récupérer le authToken d'authentification depuis les cookies
      const authToken = getCookie('authToken');
  
      // Si il est vide c'est que l'utilisateur n'est pas connecté
      if (!authToken) {
          console.log('No valid token');
          return dispatch({
            type: 'ADD_TO_PLAYLIST_FAIL',
            payload: 'You need to be logged in to add a product to the playlist. Please log in or create an account.',
          });
      }
  
      // Envoie du cookie dans le header Authorization
      const config = {
        headers: {
          'Content-Type': 'application/json', 
          'Authorization' : `Bearer ${authToken}`
        }
      };
  
      // Corps de la requête
      const body = {
        playlistId,
        songId
      };
  
      // Déclencher l'action de requête en cours
      dispatch({ type: 'ADD_TO_PLAYLIST_REQUEST' });
  
      // Faire la requête API pour ajouter un produit au panier
      const response = await axios.post(
        `http://localhost:3100/api/v1/playlist/add-to-playlist`,
        body,
        config
      );
  
      // Succès, retourner les données dans action.payload
      dispatch({
        type: 'ADD_TO_PLAYLIST_SUCCESS',
        payload: response.data
      });
  
    } catch (error) {
      dispatch({
          type: 'ADD_TO_PLAYLIST_FAIL',
          payload: error.response && error.response.data && error.response.data.error
              ? error.response.data.error
              : error.message,
      });

      alert('product already exist in the playlist')
  }
};

// FETCH ALL PLAYLIST 
export const fetchAllPlaylist = (params) => async (dispatch, getState) => {
  try {

    // Récupérer le authToken d'authentification depuis les cookies
    const authToken = getCookie('authToken');

    // Si il est vide c'est que l'utilisateur n'est pas connecté
    if (!authToken) {
        console.log('No valid token');
        return dispatch({
          type: 'FETCH_ALL_PLAYLIST_FAIL',
          payload: 'You need to be logged in to fetch all the playlist. Please log in or create an account.',
        });
    }

    // Envoie du cookie dans le header Authorization
    const config = {
      headers: {
        'Content-Type': 'application/json', 
        'Authorization' : `Bearer ${authToken}`
      }
    };

    // Déclencher l'action de requête en cours
    dispatch({ type: 'FETCH_ALL_PLAYLIST_REQUEST' });

    // Faire la requête API pour ajouter un produit au panier
    const response = await axios.get(
      `http://localhost:3100/api/v1/playlist/fetch-all-playlists`,
      config
    );

    // Succès, retourner les données dans action.payload
    dispatch({
      type: 'FETCH_ALL_PLAYLIST_SUCCESS',
      payload: response.data
    });

  } catch (error) {
    dispatch({
      type: 'FETCH_ALL_PLAYLIST_FAIL',
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// FETCH ONE
export const fetchPlaylistDetail = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'FETCH_PLAYLIST_DETAIL_REQUEST' });

    const authToken = getCookie('authToken');
    if (!authToken) {
      return dispatch({
        type: 'FETCH_PLAYLIST_DETAIL_FAIL',
        payload: 'You need to be logged in to view this playlist.',
      });
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    };

    const { data } = await axios.get(`http://localhost:3100/api/v1/playlist/${id}`, config);

    dispatch({
      type: 'FETCH_PLAYLIST_DETAIL_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_PLAYLIST_DETAIL_FAIL',
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// CREATE PLAYLIST
export const createPlaylist = (params) => async (dispatch, getState) => {
    try {
        const {
            name, 
            description, 
            cover 
        } = params;

        // Récupérer le authToken depuis les cookies 
        const authToken = getCookie('authToken');

        if (!authToken) {
            console.log('No valid token');
            return dispatch({
            type: 'CREATE_PLAYLIST_FAIL',
            payload: 'You need to be logged in to create a playlist. Please log in or create an account.',
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
            name, 
            description, 
            cover 
        };
  
      // Déclenchement de la requete de connexion
      dispatch({ type: 'CREATE_PLAYLIST_REQUEST'});
  
      // API de connexion
      const response = await axios.post(`http://localhost:3100/api/v1/playlist/create-playlist`, body, config);

  
      dispatch({
          type: 'CREATE_PLAYLIST_SUCCESS',
          payload: response.data
        });
      
  
    } catch (error) {
      dispatch({
          type: 'CREATE_PLAYLIST_FAIL',
          payload: error.response && error.response.data ? error.response.data : error.message
      })
    }
  };


// DELETE ONE 
export const deletePlaylist = (id,params) => async (dispatch, getState) => {
    try {

        // Récupérer le authToken depuis les cookies 
        const authToken = getCookie('authToken');

        if (!authToken) {
            console.log('No valid token');
            return dispatch({
            type: 'DELETE_PLAYLIST_FAIL',
            payload: 'You need to be logged in to delete the playlist. Please log in or create an account.',
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
  
      // Déclenchement de la requete de connexion
      dispatch({ type: 'DELETE_PLAYLIST_REQUEST'});
  
      // API de connexion
      const response = await axios.delete(`http://localhost:3100/api/v1/playlist/delete-playlist/${id}`, config);

  
      dispatch({
          type: 'DELETE_PLAYLIST_SUCCESS',
          payload: response.data
        });
      
  
    } catch (error) {
      dispatch({
          type: 'DELETE_PLAYLIST_FAIL',
          payload: error.response && error.response.data ? error.response.data : error.message
      })
    }
  };

// DELETE ALL 
export const deleteAllPlaylist = () => async (dispatch, getState) => {
    try {
      // Recuperer authToken depuis les cookies 
      const authToken = getCookie('authToken');
      
      if (!authToken) {
          console.log('No valid token');
          return dispatch({
            type: 'DELETE_ALL_PLAYLIST_FAIL',
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
  
      dispatch({ type: 'DELETE_ALL_PLAYLIST_REQUEST' });
  
      await axios.delete('http://localhost:3100/api/v1/playlist/clear', config);
  
      dispatch({ type: 'DELETE_ALL_PLAYLIST_SUCCESS' });
  
    } catch (error) {
      dispatch({
        type: 'DELETE_ALL_PLAYLIST_FAIL',
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
};