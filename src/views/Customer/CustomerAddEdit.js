import React, { useEffect, useState, Fragment } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
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
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilTrash } from '@coreui/icons'

import {
  CitySelect,
  CountrySelect,
  HFAutoComplete,
  HFCheckBox,
  HFDatePicker,
  HFPhoneInput,
  HFTextArea,
  HFTextField,
  LoadingButton,
  ProvinceSelect,
  Spinner,
  Toast,
} from 'components'

import Axios from 'services/api/Config'
import { getDataFromObject } from 'utils/Common'
import { CUSTOMER_DOC_OPTIONS } from 'constants/customer.constant'
import {
  customerAddURL,
  getCustomerByIDURL,
  updateCustomerByIDURL,
} from 'services/api/routes/customer'

const customerAddEditSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  IdNumber: Yup.string().required('Identification is required'),
  email: Yup.string().required('Email is required').email('Please enter valid email'),
  phone: Yup.string().required('Mobile is required'),
  profession: Yup.string().required('Profession is required'),
  dob: Yup.string().required('Date of Birth is required'),
  ppv: Yup.boolean(),
  address_line_1: Yup.string().trim().required('Address is required'),
  address_line_2: Yup.string().trim(),
  countryId: Yup.string().required('Country is required'),
  provinceId: Yup.string().required('Province is required'),
  cityId: Yup.string().required('City is required'),
  postal_code: Yup.string().trim().required('Zip Code is required'),
  identityDocs: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().required('Document type is required'),
      value: Yup.string().required('Document value is required'),
    }),
  ),
})

const initialFieldArray = { type: null, value: '' }

const CustomerAddEdit = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRecordLoading, setIsRecordLoading] = useState(false)

  let { customerId } = useParams()
  const navigate = useNavigate()

  const match = useMatch('/customer/edit/:customerId')
  const isEdit = match ? true : false

  const initialValues = {
    first_name: '',
    last_name: '',
    IdNumber: '',
    email: '',
    phone: '',
    profession: '',
    address_line_1: '',
    address_line_2: '',
    countryId: '',
    provinceId: '',
    cityId: '',
    dob: '',
    ppv: false,
    postal_code: '',
    identityDocs: isEdit ? [] : [initialFieldArray],
  }

  const {
    watch,
    setValue,
    handleSubmit,
    control: customerControl,
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(customerAddEditSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control: customerControl,
    name: 'identityDocs',
  })

  useEffect(() => {
    if (customerId && isEdit) {
      setIsRecordLoading(true)
      Axios({ ...getCustomerByIDURL(customerId) })
        .then((response) => {
          const res = response.data.data
          if (res) {
            ;[
              'first_name',
              'last_name',
              'email',
              'phone',
              'profession',
              'address_line_1',
              'address_line_2',
              'countryId',
              'provinceId',
              'cityId',
              'postal_code',
              'IdNumber',
              'dob',
            ].forEach((field) =>
              setValue(field, getDataFromObject(res, field) ? getDataFromObject(res, field) : ''),
            )
            setValue('identityDocs', getDataFromObject(res, 'identityDocs') ?? initialFieldArray)
            setValue('ppv', getDataFromObject(res, 'ppv'))
          }
        })
        .catch(() => {
          navigate(`/customer`)
        })
        .finally(() => {
          setIsRecordLoading(false)
        })
    }
  }, [isEdit, setValue, customerId, navigate])

  const onSubmit = (data) => {
    setIsLoading(true)
    if (isEdit) {
      Axios({ ...updateCustomerByIDURL(customerId), data: data })
        .then((res) => {
          Toast.success(res.data.message)
          navigate(`/customer/view/${res.data.data?._id}`)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      Axios({ ...customerAddURL, data: data })
        .then((res) => {
          Toast.success(res.data.message)
          navigate(`/customer/view/${res.data.data?._id}`)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="bg-white">
          <h4 className="text-primary mb-0 fw-bold">{isEdit ? 'Edit' : 'Add'} Customer</h4>
        </CCardHeader>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          {isRecordLoading ? (
            <div className="my-3">
              <Spinner />
            </div>
          ) : (
            <CCardBody>
              <div className="row">
                <div className="col-lg-6">
                  <CCard className="mb-3">
                    <CCardHeader>
                      <div className="text-primary ">Basic Details</div>
                    </CCardHeader>
                    <CCardBody>
                      <div className="row">
                        <div className="col-md-6">
                          <HFTextField
                            id="first_name"
                            name="first_name"
                            label="First Name"
                            control={customerControl}
                            isController={true}
                          />
                        </div>
                        <div className="col-md-6">
                          <HFTextField
                            id="last_name"
                            name="last_name"
                            label="Last Name"
                            control={customerControl}
                            isController={true}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <HFTextField
                            id="IdNumber"
                            name="IdNumber"
                            label="Identification"
                            control={customerControl}
                            isController={true}
                          />
                        </div>
                        <div className="col-md-6">
                          <HFTextField
                            id="profession"
                            name="profession"
                            label="Profession"
                            control={customerControl}
                            isController={true}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <HFDatePicker
                            id="dob"
                            name="dob"
                            label="Date of Birth"
                            control={customerControl}
                            isController={true}
                          />
                        </div>
                        <div className="col-md-6">
                          <HFPhoneInput
                            id="phone"
                            name="phone"
                            label="Mobile"
                            control={customerControl}
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
                            control={customerControl}
                            isController={true}
                          />
                        </div>
                        <div className="col-md-6">
                          <HFCheckBox
                            id="ppv"
                            name="ppv"
                            label="PPV (Politically Vulnerable Person)"
                            control={customerControl}
                            isController={true}
                          />
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                  <CCard className="mb-3">
                    <CCardHeader>
                      <div className="text-primary">Address</div>
                    </CCardHeader>
                    <CCardBody>
                      <div className="row">
                        <div className="col-md-6">
                          <HFTextArea
                            id="address_line_1"
                            name="address_line_1"
                            label="Address 1"
                            control={customerControl}
                            isController={true}
                          />
                        </div>
                        <div className="col-md-6">
                          <HFTextArea
                            id="address_line_2"
                            name="address_line_2"
                            label="Address 2"
                            control={customerControl}
                            isController={true}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <Controller
                            control={customerControl}
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
                            control={customerControl}
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
                        <div className="col-md-6 mb-3">
                          <Controller
                            control={customerControl}
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
                            id="postal_code"
                            name="postal_code"
                            label="Zip Code"
                            control={customerControl}
                            isController={true}
                          />
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </div>
                <div className="col-lg-6">
                  <CCard className="mb-3">
                    <CCardHeader className="d-flex">
                      <div className="text-primary">Identification Details</div>
                      <CButton
                        size="sm"
                        color="primary"
                        className="ms-auto"
                        onClick={() => append(initialFieldArray)}
                      >
                        <CIcon icon={cilPlus} size="sm" /> Add
                      </CButton>
                    </CCardHeader>
                    <CCardBody>
                      {fields.map((item, index) => (
                        <Fragment key={index}>
                          <div className="row">
                            <div className="col-10 col-md-11">
                              <div className="row">
                                <div className="col-md-6">
                                  <HFAutoComplete
                                    id={`identityDocs.${index}.type`}
                                    name={`identityDocs.${index}.type`}
                                    label="Document type"
                                    isController={true}
                                    options={CUSTOMER_DOC_OPTIONS}
                                    control={customerControl}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <HFTextField
                                    id={`identityDocs.${index}.value`}
                                    name={`identityDocs.${index}.value`}
                                    label="Document Value"
                                    control={customerControl}
                                    isController={true}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-2 col-md-1 align-self-center">
                              {index > 0 ? (
                                <CTooltip content="Delete field">
                                  <CButton
                                    size="sm"
                                    color="danger"
                                    className="rounded-btn-pill mt-3"
                                    shape="rounded-pill"
                                    variant="ghost"
                                    onClick={() => remove(index)}
                                  >
                                    <CIcon icon={cilTrash} size="lg" />
                                  </CButton>
                                </CTooltip>
                              ) : null}
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </CCardBody>
                  </CCard>
                </div>
              </div>
            </CCardBody>
          )}
          <CCardFooter className="bg-white d-flex">
            <Link to="/customer" className="">
              <CButton className="px-4" variant="outline" color="primary">
                Back
              </CButton>
            </Link>
            <LoadingButton
              loading={isLoading || isRecordLoading}
              // disabled={!isValid}
              color="primary"
              type="submit"
              className="px-4 ms-auto"
            >
              {isEdit ? 'Update' : 'Add'} Customer
            </LoadingButton>
          </CCardFooter>
        </CForm>
      </CCard>
    </>
  )
}

export default CustomerAddEdit
