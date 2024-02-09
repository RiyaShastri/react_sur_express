import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import Axios from 'services/api/Config'
import { Toast } from 'components'
import { useAuthUser } from './AuthUserContext'
import { authUserLogout } from 'redux/Actions/AuthActions'
import { getUserPermissionsURL } from 'services/api/routes/auth'

const initialContextState = {
  permissions: null,
  isFetching: true,
  fetchNewPermissions: () => {},
}

const PermissionContext = createContext(initialContextState)

const usePermission = () => {
  return useContext(PermissionContext)
}

const PermissionProvider = ({ children }) => {
  const [isFetching, setIsFetching] = useState(initialContextState.isFetching)
  const [permissions, setPermissions] = useState(initialContextState.permissions)
  const { auth_token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const { authUser } = useAuthUser()

  const token = useMemo(() => !!auth_token, [auth_token])

  const fetchPermissions = useCallback(async () => {
    setIsFetching(true)
    try {
      if (authUser) {
        if (!token) {
          setPermissions(initialContextState.permissions)
        }
        if (token && !permissions) {
          const permissionRes = await Axios({ ...getUserPermissionsURL })
          const finalPermissionObj = {}
          Object.keys(permissionRes.data.data).forEach((per) => {
            finalPermissionObj[per.replace('-', '_')] = permissionRes?.data?.data[per]
          })
          setPermissions(finalPermissionObj)
        }
      }
    } catch (err) {
      dispatch(authUserLogout()).then(() => {
        Toast.error('Network Error!!')
      })
    } finally {
      setIsFetching(false)
    }
  }, [dispatch, permissions, token, authUser])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  const fetchNewPermissions = useCallback(() => {
    setPermissions(initialContextState.permissions)
    fetchPermissions()
  }, [fetchPermissions])

  return (
    <PermissionContext.Provider value={{ isFetching, permissions, fetchNewPermissions }}>
      {children}
    </PermissionContext.Provider>
  )
}

PermissionProvider.propTypes = {
  children: PropTypes.node,
}

export { PermissionProvider, usePermission }
