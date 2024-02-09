import {
  COUNTRY_LIST_SUCCESS,
  CURRENCY_LIST_SUCCESS,
  GENERAL_FAILED,
  GENERAL_REQUEST,
  SET_SIDE_BAR,
  SET_SIDE_FOLD,
} from 'redux/ActionType'
import Axios from 'services/api/Config'
import { countryListURL, currencyListURL } from 'services/api/routes/common'

export const toggleSideBar = (value) => {
  return (dispatch) => {
    dispatch({ type: SET_SIDE_BAR, payload: value })
  }
}

export const toggleSideBarFold = () => {
  return (dispatch) => {
    dispatch({ type: SET_SIDE_FOLD })
  }
}

export const getCountryList = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GENERAL_REQUEST })
      let response = await Axios({ ...countryListURL, data: data })
      const res = response.data.data.list

      dispatch({
        type: COUNTRY_LIST_SUCCESS,
        payload: res,
      })
      return res
    } catch (error) {
      dispatch({
        type: GENERAL_FAILED,
        payload: error?.response?.data,
      })
    }
  }
}

export const getCurrencyList = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GENERAL_REQUEST })
      let response = await Axios({ ...currencyListURL, data: data })
      const res = response.data.data.list

      dispatch({
        type: CURRENCY_LIST_SUCCESS,
        payload: res,
      })
      return res
    } catch (error) {
      dispatch({
        type: GENERAL_FAILED,
        payload: error?.response?.data,
      })
    }
  }
}
