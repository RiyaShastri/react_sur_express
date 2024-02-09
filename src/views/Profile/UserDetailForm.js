import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CForm } from '@coreui/react'
import { HFAutoComplete, HFPhoneInput, HFTextField, LoadingButton, Toast } from 'components'

import Axios from 'services/api/Config'
import { useAuthUser } from 'utils/context/AuthUserContext'
import { USER_ROLE_OPTIONS } from 'constants/User.constant'
import { updateUserProfileURL } from 'services/api/routes/user'
import useModulePermissions from 'utils/hooks/useModulePermissions'
import { ROLE_PERMISSIONS } from 'constants/permissions.constants'

const userSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  role: Yup.number().required('User Role is required'),
  email: Yup.string().trim().required('Email is required').email('Please enter a valid email'),
  mobile: Yup.string().required('Mobile is required'),
})

const UserDetailForm = () => {
  const [isUserLoading, setIsUserLoading] = useState(false)

  const { authUser, fetchNewUserData } = useAuthUser()
  const { permissionCheck } = useModulePermissions()
  const [isEdit, setIsEdit] = useState(false)

  const initialValues = {
    first_name: authUser?.first_name ?? '',
    last_name: authUser?.last_name ?? '',
    email: authUser?.email ?? '',
    mobile: authUser?.mobile ?? '',
    role: authUser?.role ?? null,
  }

  const {
    handleSubmit: userHandleSubmit,
    control: userControl,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(userSchema),
  })

  const onUserSubmit = (data) => {
    setIsUserLoading(true)
    if (isEdit) {
      const tData = {
        ...data,
        email: undefined,
        role: undefined,
      }
      Axios({ ...updateUserProfileURL, data: tData })
        .then((res) => {
          Toast.success(res.data.message)
          fetchNewUserData()
        })
        .finally(() => {
          setIsUserLoading(false)
          setIsEdit(false)
        })
    }
  }

  return (
    <CForm onSubmit={userHandleSubmit(onUserSubmit)}>
      <CCard className="mb-3">
        <CCardHeader>
          <div className="text-primary">User Details</div>
        </CCardHeader>
        <CCardBody>
          <div className="row">
            <div className="col-md-6">
              <HFTextField
                id="first_name"
                name="first_name"
                label="First Name"
                isDisabled={!isEdit}
                control={userControl}
                isController={true}
              />
            </div>
            <div className="col-md-6">
              <HFTextField
                id="last_name"
                name="last_name"
                label="Last Name"
                isDisabled={!isEdit}
                control={userControl}
                isController={true}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <HFTextField
                id="email"
                name="email"
                label="Email"
                control={userControl}
                isDisabled={true}
                isController={true}
              />
            </div>
            <div className="col-md-6">
              <HFPhoneInput
                id="mobile"
                name="mobile"
                label="Mobile"
                control={userControl}
                isDisabled={!isEdit}
                isController={true}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <HFAutoComplete
                id="role"
                name="role"
                label="User Role"
                isController={true}
                isDisabled={true}
                options={USER_ROLE_OPTIONS}
                control={userControl}
              />
            </div>
          </div>
        </CCardBody>
        {permissionCheck(ROLE_PERMISSIONS.PROFILE.CREATE) ? (
          <CCardFooter className="bg-white">
            {!isEdit ? (
              <>
                <CButton className="px-4" color="primary" onClick={() => setIsEdit(true)}>
                  Edit Profile
                </CButton>
              </>
            ) : (
              <div className="d-flex">
                <CButton
                  className="px-4"
                  variant="outline"
                  color="danger"
                  onClick={() => setIsEdit(false)}
                >
                  Cancel
                </CButton>
                <LoadingButton
                  loading={isUserLoading}
                  disabled={!isValid}
                  color="primary"
                  type="submit"
                  className="ms-auto px-4"
                >
                  Update Profile
                </LoadingButton>
              </div>
            )}
          </CCardFooter>
        ) : null}
      </CCard>
    </CForm>
  )
}

export default UserDetailForm
