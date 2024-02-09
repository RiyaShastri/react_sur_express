import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

// routes config
import PrivateRoutes from 'router/PrivateRoutes'

import useModulePermissions from 'utils/hooks/useModulePermissions'
import { useAuthUser } from 'utils/context/AuthUserContext'

const AppContent = () => {
  const { permissionCheck } = useModulePermissions()
  const { authUser, authType } = useAuthUser()

  const routes = PrivateRoutes({ authUser, authType })

  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <Routes>
        {routes.map((route, idx) => {
          return (
            route.element &&
            permissionCheck(route?.isRouteAccessible) && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                element={<route.element />}
              />
            )
          )
        })}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Suspense>
  )
}

export default React.memo(AppContent)
