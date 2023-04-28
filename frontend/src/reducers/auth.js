import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOADED_USER_SUCCESS,
  LOADED_USER_FAIL,
  LOGOUT,
  AUTHENTICATED_FAIL,
  AUTHENTICATED_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_CONFIRM_FAIL,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  GOOGLE_AUTH_SUCCESS,
  GOOGLE_AUTH_FAIL,
} from "../actions/types.js";

const initialState = {
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  isAuthenticated: null,
  user: null,
};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case AUTHENTICATED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };

    case AUTHENTICATED_FAIL:
      return {
        ...state,
        isAuthenticated: false,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("access", payload.access);
      return {
        ...state,
        isAuthenticated: true,
        access: payload.access,
        refresh: payload.refresh,
      };
    case LOADED_USER_FAIL: {
      return {
        ...state,
        user: null,
      };
    }
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
      };
    case LOADED_USER_SUCCESS: {
      return {
        ...state,
        user: payload,
      };
    }
    case GOOGLE_AUTH_SUCCESS:
      localStorage.setItem("access", payload.access);
      return {
        ...state,
        isAuthenticated: true,
        access: payload.access,
        refresh: payload.refresh,
      };
    case GOOGLE_AUTH_FAIL:
    case LOGOUT:
    case SIGN_UP_FAIL:
    case LOGIN_FAIL:
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
      };

    case ACTIVATION_FAIL:
      return { ...state };
    case ACTIVATION_SUCCESS:
      return { ...state };
    case PASSWORD_RESET_FAIL:
      return { ...state };
    case PASSWORD_RESET_SUCCESS:
      return { ...state };
    case PASSWORD_RESET_CONFIRM_FAIL:
      return { ...state };
    case PASSWORD_RESET_CONFIRM_SUCCESS:
      return { ...state };
    default: {
      return state;
    }
  }
}
