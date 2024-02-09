import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { CForm, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

import { HFTextField, LoadingButton, Toast } from 'components'
import { updateCurrencyChargesByIDURL } from 'services/api/routes/conversion-rate'
import Axios from 'services/api/Config'

const rateUpdateSchema = Yup.object().shape({
  percentage: Yup.number()
    .required('Percentage is required')
    .typeError('Please enter a valid number'),
})

const UpdateRateModel = ({
  changeRateModel,
  setChangeRateModel,
  onClose = () => {},
  setRefreshToggle = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const initialValues = {}

  const {
    setValue,
    handleSubmit,
    control: rateControl,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(rateUpdateSchema),
  })

  const handleClose = () => {
    setChangeRateModel(null)
    onClose()
  }

  const handleRateUpdate = (data) => {
    setIsLoading(true)
    Axios({ ...updateCurrencyChargesByIDURL(changeRateModel?._id), data: data })
      .then((res) => {
        Toast.success(res.data.message)
        onClose()
      })
      .finally(() => {
        setIsLoading(false)
        setRefreshToggle((prev) => !prev)
      })
  }

  useEffect(() => {
    setValue('percentage', changeRateModel?.percentage)
  }, [changeRateModel?.percentage, setValue])

  return (
    <CModal backdrop="static" alignment="center" visible={!!changeRateModel} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>Update Conversion Rate</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit(handleRateUpdate)}>
        <CModalBody>
          <div className="row">
            <p>
              <span className="fw-bold me-2">Current Rate:</span>
              <span>{changeRateModel?.percentage} %</span>
            </p>
          </div>
          <div className="row">
            <div className="col-12">
              <HFTextField
                id="percentage"
                name="percentage"
                label="New Rate"
                control={rateControl}
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

UpdateRateModel.propTypes = {
  changeRateModel: PropTypes.any,
  onClose: PropTypes.func,
  setChangeRateModel: PropTypes.func,
  setRefreshToggle: PropTypes.func,
}

export default UpdateRateModel
