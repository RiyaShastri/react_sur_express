import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CForm,
  CFormFeedback,
} from '@coreui/react'

import {
  CitySelect,
  CountrySelect,
  HFTextArea,
  HFTextField,
  LoadingButton,
  ProvinceSelect,
  Spinner,
  Toast,
} from 'components'
import Axios from 'services/api/Config'

import { getStoreByIDURL, storeAddURL, updateStoreByIDURL } from 'services/api/routes/store'
import { getDataFromObject } from 'utils/Common'

const storeAddEditSchema = Yup.object().shape({
  name: Yup.string().trim().required('Store Name is required'),
  address_line_1: Yup.string().trim().required('Address is required'),
  address_line_2: Yup.string().trim(),
  countryId: Yup.string().required('Country is required'),
  provinceId: Yup.string().required('Province is required'),
  cityId: Yup.string().required('City is required'),
  zipcode: Yup.string().trim().required('Zip Code is required'),
})

const initialValues = {
  name: '',
  address_line_1: '',
  address_line_2: '',
  countryId: '',
  provinceId: '',
  cityId: '',
  zipcode: '',
}

const StoreAddEdit = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRecordSpinner, setIsRecordSpinner] = useState(false)

  let { storeId } = useParams()
  const navigate = useNavigate()

  const match = useMatch('/store/edit/:storeId')
  const isEdit = match ? true : false

  const {
    watch,
    setValue,
    handleSubmit,
    control: storeControl,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(storeAddEditSchema),
  })

  useEffect(() => {
    if (storeId && isEdit) {
      setIsRecordSpinner(true)
      Axios({ ...getStoreByIDURL(storeId) })
        .then((response) => {
          const res = response.data.data
          if (res) {
            const list = [
              'name',
              'address_line_1',
              'address_line_2',
              'zipcode',
              'countryId',
              'provinceId',
              'cityId',
            ]
            list.forEach((field) => {
              setValue(field, getDataFromObject(res, field) || '')
            })
          }
        })
        .finally(() => {
          setIsRecordSpinner(false)
        })
    }
  }, [isEdit, setValue, storeId])

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      if (isEdit) {
        const res = await Axios({ ...updateStoreByIDURL(storeId), data: data })
        Toast.success(res.data.message)
      } else {
        const res = await Axios({ ...storeAddURL, data: data })
        Toast.success(res.data.message)
        navigate(`/store`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="bg-white">
          <h4 className="text-primary mb-0 fw-bold">{isEdit ? 'Edit' : 'Add'} Store</h4>
        </CCardHeader>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          {isRecordSpinner ? (
            <div className="my-3">
              <Spinner />
            </div>
          ) : (
            <CCardBody>
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <CCard className="mb-3">
                    <CCardHeader>
                      <div className="text-primary ">Basic Details</div>
                    </CCardHeader>
                    <CCardBody>
                      <HFTextField
                        id="name"
                        name="name"
                        label="Store Name"
                        control={storeControl}
                        isController={true}
                      />
                    </CCardBody>
                  </CCard>
                  <CCard className="mb-3">
                    <CCardHeader>
                      <div className="text-primary">Store Address</div>
                    </CCardHeader>
                    <CCardBody>
                      <div className="row">
                        <div className="col-md-6">
                          <HFTextArea
                            id="address_line_1"
                            name="address_line_1"
                            label="Address 1"
                            control={storeControl}
                            isController={true}
                          />
                        </div>
                        <div className="col-md-6">
                          <HFTextArea
                            id="address_line_2"
                            name="address_line_2"
                            label="Address 2"
                            control={storeControl}
                            isController={true}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <Controller
                            control={storeControl}
                            name="countryId"
                            render={({ field, fieldState: { error } }) => (
                              <>
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
                              </>
                            )}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <Controller
                            control={storeControl}
                            name="provinceId"
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <ProvinceSelect
                                  label="Province"
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
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <Controller
                            control={storeControl}
                            name="cityId"
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <CitySelect
                                  label="City"
                                  isError={!!error}
                                  countryCode={watch('countryId') ?? undefined}
                                  provinceCode={watch('provinceId') ?? undefined}
                                  defaultValue={field.value ?? undefined}
                                  handleOnChange={(newValue) => field.onChange(newValue?.cityId)}
                                />
                                {error && (
                                  <CFormFeedback className="small text-danger" type="invalid">
                                    {error.message}
                                  </CFormFeedback>
                                )}
                              </>
                            )}
                          />
                        </div>
                        <div className="col-md-6">
                          <HFTextField
                            id="zipcode"
                            name="zipcode"
                            label="Zip Code"
                            control={storeControl}
                            isController={true}
                          />
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </div>
              </div>
            </CCardBody>
          )}
          <CCardFooter className="bg-white d-flex">
            <Link to="/store" className="">
              <CButton className="px-4" variant="outline" color="primary">
                Back
              </CButton>
            </Link>
            <LoadingButton
              loading={isLoading || isRecordSpinner}
              disabled={!isValid}
              color="primary"
              type="submit"
              className="px-4 ms-auto"
            >
              {isEdit ? 'Update' : 'Add'} Store
            </LoadingButton>
          </CCardFooter>
        </CForm>
      </CCard>
    </>
  )
}

export default StoreAddEdit
