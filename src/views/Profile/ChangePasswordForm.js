import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CForm } from '@coreui/react'
import { HFPassword, LoadingButton, Toast } from 'components'

import Axios from 'services/api/Config'
import { updateUserPasswordURL } from 'services/api/routes/user'
import { useAuthUser } from 'utils/context/AuthUserContext'
import { ROLE_PERMISSIONS } from 'constants/permissions.constants'
import useModulePermissions from 'utils/hooks/useModulePermissions'

const changePasswordSchema = Yup.object().shape({
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

const ChangePasswordForm = () => {
  const { authUser } = useAuthUser()
  const { permissionCheck } = useModulePermissions()
  const [isLoading, setIsLoading] = useState(false)

  const [isEdit, setIsEdit] = useState(false)

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(changePasswordSchema),
  })

  const onUserSubmit = (data) => {
    setIsLoading(true)
    if (isEdit) {
      const tData = {
        ...data,
        _id: authUser?._id,
      }
      Axios({ ...updateUserPasswordURL, data: tData })
        .then((res) => {
          Toast.success(res.data.message)
        })
        .finally(() => {
          setIsLoading(false)
          handleCancel()
        })
    }
  }

  const handleCancel = () => {
    reset(initialValues)
    setIsEdit(false)
  }

  return (
    <CForm onSubmit={handleSubmit(onUserSubmit)}>
      <CCard>
        <CCardHeader>
          <div className="text-primary">Change Password</div>
        </CCardHeader>
        <CCardBody>
          <HFPassword
            id="temporaryPassword"
            name="temporaryPassword"
            label="Current Password"
            control={control}
            isController={true}
            isDisabled={!isEdit}
          />
          <HFPassword
            id="password"
            name="password"
            label="New Password"
            control={control}
            isController={true}
            isDisabled={!isEdit}
          />
          <HFPassword
            id="passwordConfirmation"
            name="passwordConfirmation"
            label="New Password Confirmation"
            control={control}
            isController={true}
            isDisabled={!isEdit}
          />
        </CCardBody>
        {permissionCheck(ROLE_PERMISSIONS.PROFILE.CREATE) ? (
          <CCardFooter className="bg-white">
            {!isEdit ? (
              <>
                <CButton className="px-4" color="primary" onClick={() => setIsEdit(true)}>
                  Change Password
                </CButton>
              </>
            ) : (
              <div className="d-flex">
                <CButton className="px-4" variant="outline" color="danger" onClick={handleCancel}>
                  Cancel
                </CButton>
                <LoadingButton
                  loading={isLoading}
                  disabled={!isValid}
                  color="primary"
                  type="submit"
                  className="ms-auto px-4"
                >
                  Update Password
                </LoadingButton>
              </div>
            )}
          </CCardFooter>
        ) : null}
      </CCard>
    </CForm>
  )
}

export default ChangePasswordForm
