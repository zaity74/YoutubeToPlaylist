
// ------------------------ LOGIN -----------------------------------------------------
const loginTokenStorage = localStorage.getItem("loginToken")
  ? JSON.parse(localStorage.getItem("loginToken"))
  : [];
const loginInfoStorage = localStorage.getItem("loginInfo")
? JSON.parse(localStorage.getItem("loginInfo"))
: false;

const userLoginState = {
    user: loginTokenStorage,
    loading : false,
    error : null,
    isLogin : loginInfoStorage,
}

export const userLoginReducer = (state = userLoginState, action) => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return {
                ...state,
                loading: true
            }
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                user : action.payload,
                isLogin : true, 
            }
        case 'LOGIN_FAILURE':
            return {
                ...state,
                loading: false,
                error : action.payload,
                isLogin : false, 
            }
        case 'USER_LOGOUT_REQUEST':
            return {
                ...state,
                loading: true,
                user : {},
                isLogin : false, 
            }
        case 'USER_LOGOUT_SUCCESS':
            return {
                ...state,
                loading: false,
                user : action.payload,
                isLogin : false, 
            }
        case 'USER_LOGOUT_FAIL':
            return {
                ...state,
                loading: false,
                error : action.payload,
                isLogin : false, 
            }
        default:
            return state
    }
}
// ------------------------ REGISTER -----------------------------------------------------

const registerTokenStorage = localStorage.getItem("registerToken")
  ? JSON.parse(localStorage.getItem("registerToken"))
  : [];


const userRegisterState = {
    register: registerTokenStorage,
    loading : false,
    error : null,
    isRegister : false,

}
export const userRegisterReducer = (state = userRegisterState, action) => {
    switch (action.type) {
        case 'REGISTER_REQUEST':
            return {
                ...state,
                loading: false
            }
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                loading: false,
                user: action.payload,
                isRegister : true, 
            }
        case 'REGISTER_FAILURE':
            return {
                ...state,
                loading: false,
                error : action.payload,
                isRegister : false, 
            }
        case 'REMOVE_REGISTER':
            return {
                ...state,
                loading: false,
                user : {},
                isRegister : false, 
            }
        default:
            return state
    }
}


// ------------------------ FORGOT PASSWORD -----------------------------------------------------
const forgotPasswordState = {
    loading: false,
    success: false,
    error: null
  };
  
  export const forgotPasswordReducer = (state = forgotPasswordState, action) => {
    switch (action.type) {
      case 'FORGOT_PASSWORD_REQUEST':
        return { ...state, loading: true };
      case 'FORGOT_PASSWORD_SUCCESS':
        return { ...state, loading: false, success: true };
      case 'FORGOT_PASSWORD_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };