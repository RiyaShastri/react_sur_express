import {
  COUNTRY_LIST_SUCCESS,
  CURRENCY_LIST_SUCCESS,
  GENERAL_FAILED,
  GENERAL_REQUEST,
  GENERAL_RESET,
  SET_SIDE_BAR,
  SET_SIDE_FOLD,
} from '../ActionType'

const initialState = {
  isLoading: false,
  isError: false,
  message: '',
  country: [],
  currency: [],
  filteredCountry: [],
  sidebarShow: true,
  sidebarUnfoldable: false,
}

const GeneralReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GENERAL_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
        message: '',
      }

    case GENERAL_FAILED:
      return {
        ...state,
        message: payload,
        isLoading: false,
        isError: true,
      }

    case SET_SIDE_BAR:
      return {
        ...state,
        sidebarShow: payload,
      }

    case SET_SIDE_FOLD:
      return {
        ...state,
        sidebarUnfoldable: !state.sidebarUnfoldable,
      }

    case COUNTRY_LIST_SUCCESS:
      const tFilteredCountries = payload.filter((record) => !record.isRestricted)
      return {
        ...state,
        country: payload,
        filteredCountry: tFilteredCountries,
        isLoading: false,
      }
    case CURRENCY_LIST_SUCCESS:
      return {
        ...state,
        currency: payload,
        isLoading: false,
      }

    case GENERAL_RESET:
      return {
        ...initialState,
      }

    default:
      return state
  }
}

export default GeneralReducer
