import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'

import {
  CButton,
  CForm,
  CFormFeedback,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'

import { CountrySelect, HFTextField, LoadingButton, ProvinceSelect, Toast } from 'components'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { cleanObj } from 'utils/Common'
import Axios from 'services/api/Config'
import { taxAddURL, updateTaxByIDURL } from 'services/api/routes/tax'

const taxAddEditSchema = Yup.object().shape({
  name: Yup.string().trim().required('Store Name is required'),
  percentage: Yup.number()
    .typeError('Value is required')
    .min(0, 'Value cannot be less than 0')
    .max(100, 'Value cannot be more than 100')
    .required('Value is required'),
  countryId: Yup.string().required('Country is required'),
  provinceId: Yup.string(),
})

const initialValues = {
  name: '',
  percentage: 0,
  countryId: '',
  provinceId: '',
}

const TaxAddEditModel = ({ isVisible = false, onClose, isEdit = false, rowValue }) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    control: taxControl,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(taxAddEditSchema),
  })

  useEffect(() => {
    setValue('name', rowValue?.name ?? '')
    setValue('percentage', rowValue?.percentage ?? 0)
    setValue('countryId', rowValue?.countryId ?? '')
    setValue('provinceId', rowValue?.provinceId ?? '')
  }, [rowValue, setValue])

  const onSubmit = (data) => {
    setIsLoading(true)
    if (isEdit) {
      Axios({ ...updateTaxByIDURL(rowValue?._id), data: cleanObj(data) })
        .then((res) => {
          Toast.success(res.data.message)
          reset(initialValues)
        })
        .finally(() => {
          onClose()
          setIsLoading(false)
        })
    } else {
      Axios({ ...taxAddURL, data: cleanObj(data) })
        .then((res) => {
          Toast.success(res.data.message)
          reset(initialValues)
        })
        .finally(() => {
          onClose()
          setIsLoading(false)
        })
    }
  }

  return (
    <>
      <CModal backdrop="static" alignment="center" visible={isVisible} onClose={onClose}>
        <CModalHeader>
          <CModalTitle>{`${isEdit ? 'Edit' : 'Add'} Tax`}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CModalBody>
            <>
              <HFTextField
                id="name"
                name="name"
                label="Tax Name"
                control={taxControl}
                isController={true}
              />
              <HFTextField
                id="percentage"
                name="percentage"
                label="Tax Value"
                type="number"
                control={taxControl}
                isController={true}
              />
              <Controller
                control={taxControl}
                name="countryId"
                render={({ field, fieldState: { error } }) => (
                  <div className="mb-3">
                    <CountrySelect
                      label="Country"
                      isError={!!error}
                      defaultValue={watch('countryId') ?? undefined}
                      handleOnChange={(newValue) => field.onChange(newValue?.countryId)}
                    />
                    {error && (
                      <CFormFeedback className="small text-danger" type="invalid">
                        {error.message}
                      </CFormFeedback>
                    )}
                  </div>
                )}
              />
              <Controller
                control={taxControl}
                name="provinceId"
                render={({ field, fieldState: { error } }) => (
                  <div className="mb-3">
                    <ProvinceSelect
                      label="Province/State"
                      isError={!!error}
                      countryCode={watch('countryId') ?? undefined}
                      defaultValue={field.value ?? undefined}
                      handleOnChange={(newValue) => field.onChange(newValue?._id)}
                    />
                    {error && (
                      <CFormFeedback className="small text-danger" type="invalid">
                        {error.message}
                      </CFormFeedback>
                    )}
                  </div>
                )}
              />
            </>
          </CModalBody>
          <CModalFooter className="d-flex">
            <CButton color="danger" variant="outline" onClick={onClose}>
              Close
            </CButton>
            <LoadingButton
              loading={isLoading}
              disabled={!isValid}
              color="primary"
              type="submit"
              className="px-4 ms-auto"
            >
              {`${isEdit ? 'Update' : 'Add'} Tax`}
            </LoadingButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

TaxAddEditModel.propTypes = {
  isEdit: PropTypes.bool,
  isVisible: PropTypes.bool,
  onClose: PropTypes.any,
  rowValue: PropTypes.any,
}

export default TaxAddEditModel
