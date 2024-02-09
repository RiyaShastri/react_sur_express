import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { CForm, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

import Axios from 'services/api/Config'
import { HFAutoComplete, HFPhoneInput, HFTextField, LoadingButton, Toast } from 'components'
import { updateUserByIDURL, userAddURL } from 'services/api/routes/user'
import { USER_ROLE_OPTIONS_FILTERED } from 'constants/User.constant'

const userAddEditSchema = Yup.object().shape({
  first_name: Yup.string().trim().required('First Name is required'),
  last_name: Yup.string().trim().required('Last Name is required'),
  role: Yup.number().required('User Role is required'),
  email: Yup.string().trim().required('Email is required').email('Please enter a valid email'),
  mobile: Yup.string().required('Mobile is required'),
})

const UserAddEditModel = ({ isVisible = false, onClose, isEdit = false, rowValue }) => {
  const [isLoading, setIsLoading] = useState(false)

  let { storeId } = useParams()

  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    role: null,
    storeId: storeId,
  }

  const {
    reset,
    setValue,
    handleSubmit,
    control: userControl,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(userAddEditSchema),
  })

  useEffect(() => {
    if (rowValue) {
      setValue('first_name', rowValue?.first_name ?? '')
      setValue('last_name', rowValue?.last_name ?? '')
      setValue('email', rowValue?.email ?? '')
      setValue('mobile', rowValue?.mobile ?? '')
      setValue('role', rowValue?.role ?? null)
    }
  }, [rowValue, setValue])

  const onSubmit = (data) => {
    setIsLoading(true)
    if (isEdit) {
      const tData = {
        ...data,
        email: undefined,
      }
      Axios({ ...updateUserByIDURL(rowValue?._id), data: tData })
        .then((res) => {
          Toast.success(res.data.message)
          reset(initialValues)
          onClose()
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      Axios({ ...userAddURL, data: data })
        .then((res) => {
          Toast.success(res.data.message)
          reset(initialValues)
          onClose()
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  const handleClose = () => {
    reset(initialValues)
    onClose()
  }

  return (
    <>
      <CModal backdrop="static" alignment="center" visible={isVisible} onClose={handleClose}>
        <CModalHeader>
          <CModalTitle>{`${isEdit ? 'Edit' : 'Add'} User`}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CModalBody>
            <>
              <div className="row">
                <div className="col-md-6">
                  <HFTextField
                    id="first_name"
                    name="first_name"
                    label="First Name"
                    control={userControl}
                    isController={true}
                  />
                </div>
                <div className="col-md-6">
                  <HFTextField
                    id="last_name"
                    name="last_name"
                    label="Last Name"
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
                    isDisabled={isEdit}
                    isController={true}
                  />
                </div>
                <div className="col-md-6">
                  <HFPhoneInput
                    id="mobile"
                    name="mobile"
                    label="Mobile"
                    control={userControl}
                    isController={true}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <HFAutoComplete
                    id="role"
                    name="role"
                    label="User Role"
                    isController={true}
                    options={USER_ROLE_OPTIONS_FILTERED}
                    control={userControl}
                  />
                </div>
              </div>
            </>
          </CModalBody>
          <CModalFooter className="d-flex">
            <LoadingButton
              loading={isLoading}
              disabled={!isValid}
              color="primary"
              type="submit"
              className="px-4 ms-auto"
            >
              {`${isEdit ? 'Update' : 'Add'} User`}
            </LoadingButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

UserAddEditModel.propTypes = {
  isEdit: PropTypes.bool,
  isVisible: PropTypes.bool,
  onClose: PropTypes.any,
  rowValue: PropTypes.any,
}

export default UserAddEditModel
