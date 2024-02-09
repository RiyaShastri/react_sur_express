import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { CButton, CCol, CForm, CRow } from '@coreui/react'
import { HFPassword, LoadingButton } from 'components'

import TopTitle from '../TopTitle'
import AuthWrapper from '../AuthWrapper'
import { clearLogs, resetPassword } from 'redux/Actions/AuthActions'

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string().trim().required('New Password is required'),
  passwordConfirmation: Yup.string()
    .trim()
    .required('Password Confirmation is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
})

const initialValues = {
  password: '',
  passwordConfirmation: '',
}

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const token = location.state?.token
  window.history.replaceState({}, document.title)

  useEffect(() => {
    if (!token) {
      navigate('/auth/forgot-password')
    }
  }, [token, navigate])

  const {
    handleSubmit,
    control: loginControl,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(resetPasswordSchema),
  })

  const onSubmit = (data) => {
    setIsLoading(true)
    dispatch(resetPassword(data))
      .then(() => {
        setResetMessage(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleBack = () => {
    dispatch(clearLogs())
    navigate('/auth/login')
  }

  return (
    <AuthWrapper>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <TopTitle title="Reset Password" />
        {resetMessage ? (
          <div className="text-center">You can now Login with new password.</div>
        ) : (
          <>
            <HFPassword
              id="password"
              name="password"
              label="New Password"
              control={loginControl}
              isController={true}
            />
            <HFPassword
              id="passwordConfirmation"
              name="passwordConfirmation"
              label="New Password Confirmation"
              control={loginControl}
              isController={true}
            />
            <CRow className="justify-content-center mt-4">
              <CCol>
                <div className="d-grid">
                  <LoadingButton
                    loading={isLoading}
                    disabled={!isValid}
                    color="primary"
                    type="submit"
                    className="px-4"
                  >
                    Confirm
                  </LoadingButton>
                </div>
              </CCol>
            </CRow>
          </>
        )}
        <div className="text-center mt-3">
          <CButton color="primary" variant="ghost" size="sm" onClick={handleBack}>
            Back to Login
          </CButton>
        </div>
      </CForm>
    </AuthWrapper>
  )
}

export default ResetPassword
