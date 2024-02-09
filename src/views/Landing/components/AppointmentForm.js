import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { CCard, CCardBody, CCardFooter, CCardHeader, CForm } from '@coreui/react'

import { HFDatePicker, HFPhoneInput, HFTextField, LoadingButton, Toast } from 'components'
import Axios from 'services/api/Config'
import { customerRequestAddURL } from 'services/api/routes/customer-request'

const appointmentSchema = Yup.object().shape({
  first_name: Yup.string().trim().required('First Name is required'),
  last_name: Yup.string().trim().required('Last Name is required'),
  email: Yup.string().required('Email is required'),
  mobile: Yup.string().required('Mobile is required'),
  storeId: Yup.string().required('Store is required'),
  scheduleDate: Yup.string().required('Date is required'),
})

const AppointmentForm = ({ storeId }) => {
  const [isLoading, setIsLoading] = useState(false)

  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    storeId: storeId ? storeId : '',
    scheduleDate: '',
  }

  const {
    handleSubmit,

    reset,
    formState: { isValid },
    control: appointmentControl,
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(appointmentSchema),
  })

  const onSubmit = (data) => {
    setIsLoading(true)
    Axios({ ...customerRequestAddURL, data: data })
      .then((res) => {
        Toast.success(
          "Your appointment has successfully Booked. Let us check the availability form our side.  You'll get the approve conformation mail on your given mail id.",
        )
        setIsLoading(false)
        reset()
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <CCard>
        <CCardHeader className=" d-flex align-item-center">
          <span className="text-primary fw-bold p-0">Appointment</span>
        </CCardHeader>

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

          <div className="row">
            <div className="col-md-6">
              <HFPhoneInput
                id="mobile"
                name="mobile"
                label="Mobile"
                control={appointmentControl}
                isController={true}
              />
            </div>
            <div className="col-md-6">
              <HFTextField
                id="email"
                name="email"
                label="Email"
                control={appointmentControl}
                isController={true}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <HFDatePicker
                id="scheduleDate"
                name="scheduleDate"
                label="Date"
                control={appointmentControl}
                isController={true}
                minDate={new Date()}
              />
            </div>
          </div>
        </CCardBody>
        <CCardFooter>
          <LoadingButton
            loading={isLoading}
            disabled={!isValid}
            color="primary"
            type="submit"
            className="px-4"
          >
            Submit
          </LoadingButton>
        </CCardFooter>
      </CCard>
    </CForm>
  )
}

AppointmentForm.propTypes = {
  storeId: PropTypes.any,
}

export default AppointmentForm
