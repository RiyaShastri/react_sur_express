import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { CButton, CCol, CForm, CRow } from '@coreui/react'
import { HFPassword, HFTextField, LoadingButton } from 'components'

import TopTitle from '../TopTitle'
import AuthWrapper from '../AuthWrapper'
import { useDispatch } from 'react-redux'
import { loginUser } from 'redux/Actions/AuthActions'

const loginSchema = Yup.object().shape({
  username: Yup.string().trim().required('Username is required'),
  password: Yup.string().trim().required('Password is required'),
})

const initialValues = {
  username: '',
  password: '',
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    handleSubmit,
    control: loginControl,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = (data) => {
    setIsLoading(true)
    dispatch(loginUser(data))
      .then((res) => {
        if (res?.isNewUser) {
          navigate('/auth/verifyOTP', { state: { shouldSetPassword: true } })
        } else {
          navigate('/auth/verifyOTP')
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <AuthWrapper>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <TopTitle
          title="Login to your Account"
          subTitle="Welcome back! Please enter your details."
        />
        <HFTextField
          id="username"
          name="username"
          label="Username"
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
                Login
              </LoadingButton>
            </div>
          </CCol>
        </CRow>
        <div className="text-center mt-3">
          <Link to="../forgot-password" id="forgot-password-link">
            <CButton color="primary" variant="ghost" size="sm">
              Forgot password?
            </CButton>
          </Link>
        </div>
      </CForm>
    </AuthWrapper>
  )
}

export default Login
