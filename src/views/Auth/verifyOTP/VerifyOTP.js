import React, { useCallback, useEffect, useState } from 'react'
import OTPInput from 'react-otp-input'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { CButton, CCol, CForm, CFormFeedback, CFormInput, CRow } from '@coreui/react'
import { LoadingButton } from 'components'

import TopTitle from '../TopTitle'
import OTPTimer from './OTPTimer'
import AuthWrapper from '../AuthWrapper'

import { clearLogs, resendOTP, verifyOTP } from 'redux/Actions/AuthActions'

const otpSchema = Yup.object().shape({
  pin: Yup.string().required('OTP is required').length(6, 'OTP is required'),
})

const initialValues = {
  pin: '',
}

const VerifyOTP = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [restartTimer, setRestartTimer] = useState(false)

  const { mobile } = useSelector((state) => state.auth)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const shouldResetPassword = location.state?.shouldResetPassword
  const shouldSetPassword = location.state?.shouldSetPassword
  window.history.replaceState({}, document.title)

  const time = new Date()
  time.setSeconds(time.getSeconds() + 120)

  const {
    handleSubmit,
    control: otpControl,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(otpSchema),
  })

  const onSubmit = (data) => {
    setIsLoading(true)
    const verificationData = {
      ...data,
      shouldResetPassword: shouldResetPassword || shouldSetPassword,
    }

    dispatch(verifyOTP(verificationData))
      .then((res) => {
        if (shouldResetPassword) {
          navigate('/auth/reset-password', { state: { token: true } })
        }
        if (shouldSetPassword) {
          navigate('/auth/set-password', { state: { token: true } })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleBack = useCallback(() => {
    navigate('/auth/login')
    dispatch(clearLogs())
  }, [dispatch, navigate])

  useEffect(() => {
    if (!mobile) {
      handleBack()
    }
  }, [handleBack, mobile])

  const handleReSend = () => {
    dispatch(resendOTP()).then((res) => {
      setRestartTimer(true)
      setShowLink(false)
    })
  }
  return (
    <AuthWrapper>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <TopTitle
          title="Two Factor Authentication"
          subTitle={
            <>
              <p className="mb-2" style={{ fontSize: 16 }}>
                Your account is protected with two-factor authentication.
              </p>
              <p className="mb-2 fw-bold">
                {`We have send you a text message on ******${mobile?.substring(
                  mobile.length - 4,
                )}.`}
              </p>
              <p className="mb-0"> Please enter the code below. </p>
            </>
          }
        />
        <Controller
          name="pin"
          control={otpControl}
          render={({ field: { ref, ...res } }) => (
            <div className="mb-3">
              <OTPInput
                {...res}
                onChange={(val) => res.onChange(val)}
                numInputs={6}
                shouldAutoFocus={true}
                containerStyle="d-flex justify-content-center gap-3 align-items-center"
                inputStyle="otpInput"
                renderInput={(props) => <CFormInput {...props} autoComplete="off" />}
              />
              {errors.pin && (
                <CFormFeedback className="small text-danger text-center" type="invalid">
                  {errors.pin?.message}
                </CFormFeedback>
              )}
            </div>
          )}
        />
        <CRow className="justify-content-center mt-4">
          <CCol>
            <div className="d-grid">
              <LoadingButton
                loading={isLoading}
                color="primary"
                disabled={!isValid}
                type="submit"
                className="px-4"
              >
                Verify OTP
              </LoadingButton>
            </div>
          </CCol>
        </CRow>
        <div className="text-center mt-3">
          {showLink ? (
            <div className="auth-link" onClick={handleReSend}>
              Resend Code via text message
            </div>
          ) : (
            <OTPTimer
              expiryTimestamp={time}
              timerEnd={() => setShowLink(true)}
              restartTimer={restartTimer}
            />
          )}
        </div>
        <div className="text-center mt-3">
          <CButton color="primary" variant="ghost" size="sm" onClick={handleBack}>
            Back to Login
          </CButton>
        </div>
      </CForm>
    </AuthWrapper>
  )
}

export default VerifyOTP
