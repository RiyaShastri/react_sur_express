import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { CButton, CCol, CForm, CRow } from '@coreui/react'
import { HFTextField, LoadingButton } from 'components'

import TopTitle from '../TopTitle'
import AuthWrapper from '../AuthWrapper'
import { clearLogs, forgotPassword } from 'redux/Actions/AuthActions'

const loginSchema = Yup.object().shape({
  username: Yup.string().trim().required('Username is required'),
})

const initialValues = {
  username: '',
}

const ForgotPassword = () => {
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
    dispatch(forgotPassword(data)).then(() => {
      navigate('/auth/verifyOTP', { state: { shouldResetPassword: true } })
    })
    setIsLoading(false)
  }

  const handleBack = () => {
    dispatch(clearLogs())
    navigate('/auth/login')
  }

  return (
    <AuthWrapper>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <TopTitle title="Forgot Password" subTitle="Welcome back! Please enter your details." />
        <HFTextField
          id="username"
          name="username"
          label="Username"
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
        <div className="text-center mt-3">
          <CButton color="primary" variant="ghost" size="sm" onClick={handleBack}>
            Back to Login
          </CButton>
        </div>
      </CForm>
    </AuthWrapper>
  )
}

export default ForgotPassword
