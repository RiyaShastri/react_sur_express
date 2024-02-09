import Axios from 'services/api/Config'

import {
  AUTH_FAILED,
  AUTH_REQUEST,
  AUTH_USER_LOGOUT,
  AUTH_USER_SUCCESS,
  FORGOT_PASSWORD_SUCCESS,
  RESEND_OTP_SUCCESS,
  RESET_PASSWORD_SUCCESS,
  USER_LOGIN_SUCCESS,
  USER_OTP_SUCCESS,
  VERIFY_OTP_SUCCESS,
} from 'redux/ActionType'

import {
  authUserProfileURL,
  forgotPasswordURL,
  loginUserURL,
  logoutURL,
  resendOTPURL,
  resetPasswordURL,
  verifyOTPURL,
} from 'services/api/routes/auth'
import { Toast } from 'components'

export const verifyOTP = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTH_REQUEST })
      const response = await Axios({
        ...verifyOTPURL,
        data: { pin: data.pin },
      })
      const res = response.data.data

      if (data?.shouldResetPassword) {
        res.token && localStorage.setItem('auth_token', res.token)
        dispatch({
          type: USER_OTP_SUCCESS,
          payload: res,
        })
        return res
      } else {
        localStorage.setItem('auth_token', res.token)
        dispatch({
          type: VERIFY_OTP_SUCCESS,
          payload: res,
        })
        return res
      }
    } catch (error) {
      dispatch({
        type: AUTH_FAILED,
        payload: error.response?.data,
      })
    }
  }
}

export const resendOTP = (data = {}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTH_REQUEST })
      let response = await Axios({ ...resendOTPURL, data: data })

      Toast.success(response.data.message)
      dispatch({
        type: RESEND_OTP_SUCCESS,
        payload: response.data.data,
      })
      return true
    } catch (error) {
      dispatch({
        type: AUTH_FAILED,
        payload: error.response?.data,
      })
    }
  }
}

export const forgotPassword = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTH_REQUEST })
      let response = await Axios({ ...forgotPasswordURL, data: data })
      const res = response.data.data

      localStorage.setItem('auth_token', res.token)
      dispatch({
        type: FORGOT_PASSWORD_SUCCESS,
        payload: res,
      })
      return true
    } catch (error) {
      dispatch({
        type: AUTH_FAILED,
        payload: error.response?.data,
      })
    }
  }
}

export const resetPassword = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTH_REQUEST })
      let response = await Axios({ ...resetPasswordURL, data: data })
      const res = response.data.data

      Toast.success(response.data.message)
      dispatch({
        type: RESET_PASSWORD_SUCCESS,
        payload: res,
      })
      return true
    } catch (error) {
      dispatch({
        type: AUTH_FAILED,
        payload: error.response?.data,
      })
    }
  }
}

export const loginUser = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTH_REQUEST })
      const response = await Axios({ ...loginUserURL, data: data })
      const res = response.data.data

      localStorage.setItem('auth_token', res.token)
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: res,
      })
      return res
    } catch (error) {
      dispatch({
        type: AUTH_FAILED,
        payload: error.response?.data,
      })
    }
  }
}

export const authUserData = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTH_REQUEST })
      let response = await Axios({ ...authUserProfileURL })
      const res = response.data.data

      dispatch({
        type: AUTH_USER_SUCCESS,
        payload: res,
      })
      localStorage.setItem('authId', res?.account?._id)
      return res
    } catch (error) {
      dispatch({
        type: AUTH_FAILED,
        payload: error?.response?.data,
      })
    }
  }
}

export const authUserLogout = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTH_REQUEST })
      let response = await Axios({ ...logoutURL, data: {} })

      dispatch(clearLogs())
      return response.data.data
    } catch (error) {
      dispatch({
        type: AUTH_FAILED,
        payload: error.response?.data,
      })
    }
  }
}

export const clearLogs = () => {
  return (dispatch) => {
    dispatch({ type: AUTH_USER_LOGOUT })
    // dispatch({ type: GENERAL_RESET })
    localStorage.clear()
  }
}
