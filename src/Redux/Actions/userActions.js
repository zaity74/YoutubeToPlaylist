import axios from 'axios';
// Fonction pour obtenir un cookie spécifique

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const userLogin = (email, password, access) => async (dispatch, getState) => {
  try {

    // Déclenchement de la requete de connexion
    dispatch({ type: 'LOGIN_REQUEST'})

    // Header de la requete de type JSON
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    }

    // API de connexion
    const response = await axios.post(`https://youtubetoplaylist-backend.onrender.com/api/v1/users/login`, {
      password,
      email,
    }, config);

    // Récupération du token renvoyés par la reponse
    const {token} = response.data.data;
    

    // Définir le cookie avec la date d'expiration
    document.cookie = `authToken=${token}; path=/;`;

    dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data
      });

    localStorage.setItem('loginToken', JSON.stringify(getState().userLogin.user));
    localStorage.setItem('loginInfo', JSON.stringify(getState().userLogin.isLogin));
    

  } catch (error) {
    dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.response && error.response.data ? error.response.data : error.message
    })
  }
};

export const userRegister = (firstname, lastname, email, password) => async (dispatch) => {
    try {
        dispatch({ type: 'REGISTER_REQUEST' });

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };

        const response = await axios.post('https://youtubetoplaylist-backend.onrender.com/api/v1/users/register', {
            firstname,
            lastname,
            email,
            password,
        }, config);

        dispatch({
            type: 'REGISTER_SUCCESS',
            payload: response.data
        });

    } catch (error) {
        dispatch({
            type: 'REGISTER_FAILURE',
            payload: error.response && error.response.data ? error.response.data : error.message,
        });
        console.log('SHOW ERROR :', error);
    }
};

export const userLogout = () => async (dispatch) => {
  try {
    // Récupérer le authToken d'authentification depuis les cookies
    const authToken = getCookie('authToken');

    // Si il est vide c'est que l'utilisateur n'est pas connecté
    if (!authToken) {
      console.log('No valid token');
      return dispatch({
        type: 'USER_LOGOUT_FAIL',
        payload: 'You are not logged in',
      });
    }

    // Configuration des en-têtes
   const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    },
    withCredentials: true, // Envoyer les cookies avec la requête
  };

    // Déclenchement de la requete de déconnexion
    dispatch({ type: 'USER_LOGOUT_REQUEST' });

    await axios.get('https://youtubetoplaylist-backend.onrender.com/api/v1/users/logout', config);

    localStorage.removeItem('loginToken');
    localStorage.removeItem('loginInfo');

    dispatch({ type: 'USER_LOGOUT_SUCCESS' });

  } catch (error) {
    console.error('Error during logout', error);
    dispatch({
      type: 'USER_LOGOUT_FAIL',
      payload: error.response && error.response.data ? error.response.data.message : error.message,
    });
  }
};

export const forgotPassword = (email) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'FORGOT_PASSWORD_REQUEST'})
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    }
    const response = await axios.post(`https://youtubetoplaylist-backend.onrender.com/api/v1/users/forgot-password`, {
      email,
    }, config);

    dispatch({
        type: 'FORGOT_PASSWORD_SUCCESS',
        payload: response.data
      });
    

  } catch (error) {
    dispatch({
        type: 'FORGOT_PASSWORD_FAILURE',
        payload: error.response.data && error.response.data
    })
    console.log('SHOW ERROR :', error);
  }
};

