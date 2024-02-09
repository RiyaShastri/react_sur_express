import { Toast } from 'components'
import PropTypes from 'prop-types'
import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authUserData, authUserLogout } from 'redux/Actions/AuthActions'

const initialContextState = {
  authUser: null,
  isFetching: true,
  authType: null,
  isAuth: false,
  fetchNewUserData: () => {},
}

const AuthUserContext = createContext(initialContextState)

const useAuthUser = () => {
  return useContext(AuthUserContext)
}

const AuthUserProvider = ({ children }) => {
  const [isFetching, setIsFetching] = useState(initialContextState.isFetching)
  const [authUser, setAuthUser] = useState(null)
  const [authType, setAuthType] = useState(null)

  const { auth_token } = useSelector((state) => state.auth)

  const isAuth = useMemo(() => !!auth_token, [auth_token])
  const dispatch = useDispatch()

  const fetchUserData = useCallback(async () => {
    setIsFetching(true)
    try {
      if (!isAuth) {
        setAuthUser(null)
      }
      if (isAuth && !authUser) {
        const res = await dispatch(authUserData())
        setAuthUser(res)
        setAuthType(res.role)
      }
    } catch (err) {
      dispatch(authUserLogout()).then(() => {
        Toast.error('Network Error!!')
      })
    } finally {
      setIsFetching(false)
    }
  }, [authUser, dispatch, isAuth])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const fetchNewUserData = useCallback(() => {
    setAuthUser(null)
    setAuthType(null)
    fetchUserData()
  }, [fetchUserData])

  return (
    <AuthUserContext.Provider
      value={{
        isFetching,
        authUser,
        authType,
        isAuth,
        fetchNewUserData,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  )
}

AuthUserProvider.propTypes = {
  children: PropTypes.node,
}

export { AuthUserProvider, useAuthUser }
