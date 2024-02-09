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

const setPasswordSchema = Yup.object().shape({
  temporaryPassword: Yup.string()
    .trim()
    .required('Initial Password is required')
    .min(5, 'Minimum 5 characters')
    .max(50, 'Maximum 50 characters'),
  password: Yup.string()
    .trim()
    .required('Password is required')
    .min(5, 'Minimum 5 characters')
    .max(50, 'Maximum 50 characters'),
  passwordConfirmation: Yup.string()
    .trim()
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
})

const initialValues = {
  password: '',
  temporaryPassword: '',
  passwordConfirmation: '',
}

const SetPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const token = location.state?.token
  window.history.replaceState({}, document.title)

  useEffect(() => {
    if (!token) {
      navigate('/auth/login')
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
    resolver: yupResolver(setPasswordSchema),
  })

  const onSubmit = (data) => {
    setIsLoading(true)
    dispatch(resetPassword(data))
      .then(() => {
        navigate('/auth/login')
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
        <TopTitle title="Set Password" />
        <HFPassword
          id="temporaryPassword"
          name="temporaryPassword"
          label="Initial Password"
          control={loginControl}
          isController={true}
        />
        <HFPassword
          id="password"
          name="password"
          label="Password"
          control={loginControl}
          isController={true}
        />
        <HFPassword
          id="passwordConfirmation"
          name="passwordConfirmation"
          label="Password Confirmation"
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
                Change Password
              </LoadingButton>
            </div>
          </CCol>
        </CRow>
        <div className="text-center mt-3">
          <CButton color="primary" variant="ghost" size="sm" onClick={handleBack}>
            Back to Login
          </CButton>
        </div>
      </CForm>
    </AuthWrapper>
  )
}

export default SetPassword
