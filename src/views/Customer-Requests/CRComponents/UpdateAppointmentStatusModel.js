import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import {
  CBadge,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'

import {
  CUSTOMER_REQUEST_STATUS,
  CUSTOMER_REQUEST_STATUS_OPTIONS_FILTERED,
} from 'constants/customer-request.constants'
import { HFAutoComplete, HFTextArea, LoadingButton, Toast } from 'components'
import Axios from 'services/api/Config'
import { updateCustomerRequestByIDURL } from 'services/api/routes/customer-request'
import { getStatusBadgeColor } from '../../Appointments/Appointments'
import HFDateTimePicker from 'components/formControl/HFDateTimePicker'

const statusUpdateSchema = Yup.object().shape({
  requestStatus: Yup.string().trim().required('Request status is required'),
  reason: Yup.string()
    .trim()
    .when('requestStatus', {
      is: (r) => r === CUSTOMER_REQUEST_STATUS.REJECT,
      then: (s) => s.required('Reason is required!'),
      otherwise: (s) => s.notRequired(),
    }),
  dateTime: Yup.string()
    .trim()
    .when('requestStatus', {
      is: (r) => r === CUSTOMER_REQUEST_STATUS.APPROVE,
      then: (s) => s.required('Date & Time is required!'),
      otherwise: (s) => s.notRequired(),
    }),
})

const UpdateAppointmentStatusModel = ({
  statusUpdateModel,
  setStatusUpdateModel,
  onClose = () => {},
  setRefreshToggle = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showDateTime, setShowDateTime] = useState(true)

  const initialValues = {
    requestStatus: '',
    reason: '',
    dateTime: '',
  }

  const {
    setValue,
    handleSubmit,
    control: appointmentControl,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(statusUpdateSchema),
  })

  const handleClose = () => {
    setStatusUpdateModel(null)
    onClose()
  }

  const handleStatusUpdate = (data) => {
    setIsLoading(true)
    if (data.dateTime) {
      data.dateTime = new Date(data.dateTime).toISOString()
    } else {
      data.dateTime = new Date().toISOString()
    }

    Axios({ ...updateCustomerRequestByIDURL(statusUpdateModel._id), data: data })
      .then((res) => {
        Toast.success(res.data.message)
        handleClose()
      })
      .finally(() => {
        setIsLoading(false)
        setRefreshToggle((prev) => !prev)
      })
  }

  const handleSelectChange = (value) => {
    if (value === CUSTOMER_REQUEST_STATUS.REJECT) {
      setShowDateTime(false)
    } else {
      setShowDateTime(true)
    }
  }

  useEffect(() => {
    if (statusUpdateModel?.requestStatus !== CUSTOMER_REQUEST_STATUS.OPEN) {
      setValue('requestStatus', statusUpdateModel?.requestStatus ?? '')
    } else {
      setValue('requestStatus', '')
    }
  }, [setValue, statusUpdateModel?.requestStatus])

  return (
    <CModal
      backdrop="static"
      alignment="center"
      visible={!!statusUpdateModel}
      onClose={handleClose}
    >
      <CModalHeader>
        <CModalTitle>Update Appointment Status</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit(handleStatusUpdate)}>
        <CModalBody>
          <div className="row">
            <p>
              <span className="fw-bold me-2">Current Status:</span>
              <span>
                {' '}
                <CBadge color={getStatusBadgeColor(statusUpdateModel?.requestStatus)}>
                  {statusUpdateModel?.requestStatus}
                </CBadge>
              </span>
            </p>
          </div>
          <div className="row">
            <div className="col-12 mb-3">
              <HFAutoComplete
                id="requestStatus"
                name="requestStatus"
                label="Request Status"
                isController={true}
                options={CUSTOMER_REQUEST_STATUS_OPTIONS_FILTERED}
                control={appointmentControl}
                handleOnChange={(newValue) => handleSelectChange(newValue?.value)}
              />
            </div>
            {showDateTime && (
              <div className="col-12">
                <HFDateTimePicker
                  id="dateTime"
                  name="dateTime"
                  label="Schedule Date & Time"
                  control={appointmentControl}
                  isController={true}
                  minDate={new Date()}
                />
              </div>
            )}
            <div className="col-12">
              <HFTextArea
                id="reason"
                name="reason"
                label="Reason"
                control={appointmentControl}
                isController={true}
              />
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <LoadingButton
            loading={isLoading}
            disabled={!isValid}
            color="primary"
            type="submit"
            className="px-4 ms-auto"
          >
            Update
          </LoadingButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

UpdateAppointmentStatusModel.propTypes = {
  onClose: PropTypes.func,
  setRefreshToggle: PropTypes.func,
  setStatusUpdateModel: PropTypes.func,
  statusUpdateModel: PropTypes.shape({
    _id: PropTypes.any,
    requestStatus: PropTypes.string,
  }),
}

export default UpdateAppointmentStatusModel
