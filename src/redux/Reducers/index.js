import { combineReducers } from 'redux'

import generalReducer from './GeneralReducers'
import authReducer from './AuthReducer'

export default combineReducers({
  general: generalReducer,
  auth: authReducer,
})
