import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { retry } from 'utils/Common'

// Pages
const Login = lazy(() => retry(() => import('../views/Auth/login/Login')))
const VerifyOTP = lazy(() => retry(() => import('../views/Auth/verifyOTP/VerifyOTP')))
const ResetPassword = lazy(() => retry(() => import('../views/Auth/resetPassword/ResetPassword')))
const SetPassword = lazy(() => retry(() => import('../views/Auth/setPassword/SetPassword')))
const ForgotPassword = lazy(() =>
  retry(() => import('../views/Auth/forgotPassword/ForgotPassword')),
)

const AuthRoutes = () => (
  <Routes>
    <Route path="login" element={<Login />} />
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="verifyOTP" element={<VerifyOTP />} />
    <Route path="set-password" element={<SetPassword />} />
    <Route path="reset-password" element={<ResetPassword />} />
    <Route path="*" element={<Navigate to="login" />} />
    <Route index element={<Navigate to="login" />} />
  </Routes>
)
export default AuthRoutes
