import axios from 'axios';
// Fonction pour obtenir un cookie spécifique

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};


// ADD TO HISTORY 
export const addToHistory = (id, params) => async (dispatch, getState) => {
    try {

      const { songId } = params;
  
      // Récupérer le authToken d'authentification depuis les cookies
      const authToken = getCookie('authToken');
  
      // Si il est vide c'est que l'utilisateur n'est pas connecté
      if (!authToken) {
          console.log('No valid token');
          return dispatch({
            type: 'ADD_TO_HISTORY_FAIL',
            payload: 'You need to be logged in to add a product to the cart. Please log in or create an account.',
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
        songId
      };
  
      // Déclencher l'action de requête en cours
      dispatch({ type: 'ADD_TO_HISTORY_REQUEST' });
  
      // Faire la requête API pour ajouter un produit au panier
      const response = await axios.post(
        `http://localhost:3100/api/v1/history/add-history`,
        body,
        config
      );
  
      // Succès, retourner les données dans action.payload
      dispatch({
        type: 'ADD_TO_HISTORY_SUCCESS',
        payload: response.data
      });
      
    } catch (error) {
      dispatch({
        type: 'ADD_TO_HISTORY_FAIL',
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
};

// GET ALL USER HISTORY 
export const getUserHistory = () => async (dispatch, getState) => {
    try {
      // Récupérer authToken depuis les cookies 
      const authToken = getCookie('authToken');
      
      if (!authToken) {
        console.log('il n ya pas de token iciii heuuu');
        return dispatch({
          type: 'FETCH_HISTORY_FAIL',
          payload: 'You need to be logged in to view the history. Please log in or create an account.',
        });
      }
  
      // Configuration des en-têtes si authToken est disponible
      const config = 
        {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            withCredentials: true,
          }
  
      // Déclencher l'action de requête en cours
      dispatch({ type: 'FETCH_HISTORY_REQUEST' });
  
      // Faire la requête API pour afficher les produits du panier en fonction de l'utilisateur
      const response = await axios.get(`http://localhost:3100/api/v1/history/get-history`, config);
  
      dispatch({
        type: 'FETCH_HISTORY_SUCCESS',
        payload: response.data
      });
  
    } catch (error) {
      dispatch({
        type: 'FETCH_HISTORY_FAIL',
        payload: error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
      });
    }
  };
