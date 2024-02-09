import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'

import { BackdropLoader } from 'components'
import AuthRoutes from './AuthRoutes'
import LandingPage from 'views/Landing/LandingPage'

const DefaultLayout = React.lazy(() => import('../layout/DefaultLayout'))

const Router = () => {
  const { auth_token } = useSelector((state) => state.auth)

  return (
    <Suspense fallback={<BackdropLoader />}>
      <Routes>
        {auth_token ? (
          <>
            <Route path="/*" element={<DefaultLayout />} />
            <Route index element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <>
            <Route path="auth/*" element={<AuthRoutes />} />
            <Route path="home" element={<LandingPage />} />
            {/* <Route index element={<Navigate to={'/auth/login'} />} /> */}
            <Route index element={<Navigate to={'/home'} />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  )
}

export default Router
