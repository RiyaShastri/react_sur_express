import React from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'

import { HFDatePicker, HFPhoneInput, HFTextField, LoadingButton, Toast } from 'components'
import Axios from 'services/api/Config'
import { customerRequestAddURL } from 'services/api/routes/customer-request'

const appointmentSchema = Yup.object().shape({
  first_name: Yup.string().trim().required('First Name is required'),
  last_name: Yup.string().trim().required('Last Name is required'),
  email: Yup.string().trim().required('Email is required').email('Please enter valid email'),
  mobile: Yup.string().required('Mobile is required'),
  storeId: Yup.string().required('Store is required'),
  scheduleDate: Yup.string().required('Date is required'),
})

const AppointmentSection = ({ isOpenModal, setIsOpenModal }) => {
  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    storeId: isOpenModal?.storeId ? isOpenModal.storeId : '',
    scheduleDate: '',
  }

  const {
    handleSubmit,
    formState: { isValid },
    control: appointmentControl,
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(appointmentSchema),
  })

  const onSubmit = (data) => {
    Axios({ ...customerRequestAddURL, data: data }).then((res) => {
      Toast.success(
        "Your appointment has successfully Booked. Let us check the availability form our side.  You'll get the approve conformation mail on your given mail id.",
      )
      // Toast.success(res.data.message)
      setIsOpenModal({ open: false, storeId: '' })
    })
  }

  return (
    <CModal
      backdrop="static"
      alignment="center"
      visible={isOpenModal}
      onClose={() => setIsOpenModal({ open: false, storeId: '' })}
    >
      <CModalHeader>
        <CModalTitle>Appointment</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CModalBody>
          <CCard>
            <CCardBody>
              <div className="row">
                <div className="col-md-6">
                  <HFTextField
                    id="first_name"
                    name="first_name"
                    label="First Name"
                    control={appointmentControl}
                    isController={true}
                  />
                </div>
                <div className="col-md-6">
                  <HFTextField
                    id="last_name"
                    name="last_name"
                    label="Last Name"
                    control={appointmentControl}
                    isController={true}
                  />
                </div>
              </div>
              <HFPhoneInput
                id="mobile"
                name="mobile"
                label="Mobile"
                control={appointmentControl}
                isController={true}
              />
              <HFTextField
                id="email"
                name="email"
                label="Email"
                control={appointmentControl}
                isController={true}
              />
              <HFDatePicker
                id="scheduleDate"
                name="scheduleDate"
                label="Date"
                control={appointmentControl}
                isController={true}
              />
            </CCardBody>
          </CCard>
        </CModalBody>
        <CModalFooter className="d-flex">
          <CButton
            color="primary"
            variant="outline"
            onClick={() => setIsOpenModal({ open: false, storeId: '' })}
          >
            Close
          </CButton>
          <LoadingButton
            // loading={isLoading}
            disabled={!isValid}
            color="primary"
            type="submit"
            className="px-4"
          >
            Submit
          </LoadingButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

AppointmentSection.propTypes = {
  setIsOpenModal: PropTypes.func,
  isOpenModal: PropTypes.any,
}

export default AppointmentSection
