import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'

import { BackdropLoader } from 'components'
import { getCountryList, getCurrencyList } from 'redux/Actions/GeneralActions'

import { useAuthUser } from 'utils/context/AuthUserContext'
import { usePermission } from 'utils/context/PermissionContext'

import Router from 'router/Router'

const App = () => {
  const { isFetching: fetchingUserInfo, isAuth } = useAuthUser()
  const { isFetching: fetchingPermissions, permissions } = usePermission()
  const dispatch = useDispatch()

  useEffect(() => {
    const countryObj = {
      options: {
        sort: { name: 1 },
        pagination: false,
      },
    }
    const currencyObj = {
      options: {
        sort: { name: 1 },
        pagination: false,
      },
    }

    // if (isAuth) {
    dispatch(getCountryList(countryObj))
    dispatch(getCurrencyList(currencyObj))
    // }
  }, [dispatch])

  const renderRoutes = useMemo(() => {
    if (!fetchingPermissions && !fetchingUserInfo) {
      return (isAuth && permissions) || (!isAuth && !permissions)
    }
    return !fetchingPermissions && !fetchingUserInfo
  }, [fetchingPermissions, fetchingUserInfo, isAuth, permissions])

  return (
    <>
      <BrowserRouter>
        {(fetchingUserInfo || fetchingPermissions) && <BackdropLoader />}
        {renderRoutes && <Router />}
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
