import {
  AUTH_REQUEST,
  AUTH_FAILED,
  AUTH_USER_LOGOUT,
  USER_LOGIN_SUCCESS,
  USER_OTP_SUCCESS,
  VERIFY_OTP_SUCCESS,
  RESEND_OTP_SUCCESS,
  FORGOT_PASSWORD_SUCCESS,
  RESET_PASSWORD_SUCCESS,
  AUTH_USER_SUCCESS,
} from '../ActionType'

const token = localStorage.getItem('auth_token')
const refreshToken = localStorage.getItem('refresh_token')

const initialState = {
  isLoading: false,
  auth_token: token ? token : null,
  refresh_token: refreshToken ? refreshToken : null,
  isVerified: false,
}

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case AUTH_REQUEST:
      return {
        ...state,
        isLoading: true,
      }

    case AUTH_FAILED:
      return {
        ...state,
        message: payload,
        isLoading: false,
        isError: true,
        isVerified: false,
      }

    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        auth_token: payload.token,
        isLoading: false,
      }

    case USER_LOGIN_SUCCESS:
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        mobile: payload.mobile,
        isLoading: false,
      }

    case RESET_PASSWORD_SUCCESS:
    case RESEND_OTP_SUCCESS:
    case AUTH_USER_SUCCESS:
    case USER_OTP_SUCCESS:
      return {
        ...state,
        isLoading: false,
      }

    case AUTH_USER_LOGOUT:
      return {
        isLoading: false,
        auth_token: null,
      }

    default:
      return state
  }
}

export default authReducer
