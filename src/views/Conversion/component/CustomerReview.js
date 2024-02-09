import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { CCard, CCardBody, CCardFooter, CForm, CFormCheck, CTooltip } from '@coreui/react'
import { SlQuestion } from 'react-icons/sl'

import Axios from 'services/api/Config'
import { CustomerSelect, LoadingButton, Spinner, Toast } from 'components'
import { getCustomerByIDURL, verifyCustomerURL } from 'services/api/routes/customer'
import { CUSTOMER_DOC_TYPE_LABEL } from 'constants/customer.constant'
import { useEffect } from 'react'

const CustomerReview = ({ setStep, setForm, selectedVal }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(selectedVal || null)
  const [isLoading, setIsLoading] = useState(false)
  const [customerDetail, setCustomerDetail] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const nextClickHandler = async (e) => {
    e.preventDefault()
    if (isVerified) {
      setForm(selectedCustomer)
      setStep((prev) => prev + 1)
    }
  }

  const handleCustomerSelect = (newValue) => {
    setIsVerified(false)
    setSelectedCustomer(newValue?._id)
    if (newValue) {
      fetchCustomer(newValue?._id)
    } else {
      setCustomerDetail(null)
    }
  }

  useEffect(() => {
    if (selectedVal) {
      fetchCustomer(selectedVal)
    }
  }, [selectedVal])

  const fetchCustomer = (id) => {
    setIsLoading(true)
    Axios({ ...getCustomerByIDURL(id) })
      .then((response) => {
        const res = response.data.data
        setCustomerDetail(res)
      })
      .finally(() => setIsLoading(false))

    setIsVerifying(true)
    Axios({ ...verifyCustomerURL, data: { id } })
      .then((res) => {
        if (res?.data?.data?.state === 'APPROVE') {
          setIsVerified(true)
        } else {
          Toast.error('SEON verification failed')
          setIsVerified(false)
        }
      })
      .finally(() => setIsVerifying(false))
  }

  return (
    <CCard>
      <CForm>
        <CCardBody>
          <div>
            <div className="row justify-content-center">
              <div className="col-md-6 mb-3">
                <CustomerSelect
                  label="Customer"
                  defaultCode="_id"
                  defaultValue={selectedCustomer ?? undefined}
                  handleOnChange={(newValue) => handleCustomerSelect(newValue)}
                />
              </div>
            </div>
            <div>
              {isLoading ? (
                <div className="mt-3">
                  <Spinner />
                </div>
              ) : (
                customerDetail && (
                  <div className="row mt-3 mx-auto">
                    <div className="col-md-6">
                      <h6 className="fw-bold text-primary">Basic Details</h6>
                      <div className="ms-4">
                        <div className="mb-2 fw-5">
                          <span className="fw-bold me-2">Customer name:</span>
                          <span>
                            {customerDetail?.first_name} {customerDetail?.last_name}
                          </span>
                        </div>
                        <div className="mb-2 fw-5">
                          <span className="fw-bold me-2">ID:</span>
                          <span>{customerDetail?.IdNumber}</span>
                        </div>
                        <div className="mb-2 fw-5">
                          <span className="fw-bold me-2">Phone:</span>
                          <span>{customerDetail?.phone}</span>
                        </div>
                        <div className="mb-2 fw-5">
                          <span className="fw-bold me-2">Email:</span>
                          <span>{customerDetail?.email}</span>
                        </div>
                        <div className="mb-2 fw-5">
                          <span className="fw-bold me-2">Date of Birth:</span>
                          <span>{moment(customerDetail?.dob).format('DD-MMM-YYYY')}</span>
                        </div>
                        <div className="mb-2 fw-5">
                          <span className="fw-bold me-2">Profession:</span>
                          <span>{customerDetail?.profession}</span>
                        </div>
                        <div className="mb-2 fw-5 d-flex ">
                          <div className="fw-bold me-2">
                            <CTooltip content="Politically Vulnerable Person">
                              <div>
                                PPV <SlQuestion /> :
                              </div>
                            </CTooltip>
                          </div>
                          <span>
                            <CFormCheck
                              style={{ cursor: 'pointer' }}
                              checked={customerDetail?.ppv}
                              disabled={true}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold text-primary">Documents Details</h6>
                      <div className="ms-4">
                        {customerDetail?.identityDocs?.map((doc, i) => {
                          return (
                            <div className="mb-2 fw-5" key={i}>
                              <span className="fw-bold me-2">
                                {CUSTOMER_DOC_TYPE_LABEL[doc?.type]}:
                              </span>
                              <span>{doc?.value}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </CCardBody>
        <CCardFooter className="bg-white d-flex">
          <LoadingButton
            loading={isLoading}
            disabled={!customerDetail || !isVerified}
            color="primary"
            type="submit"
            className="px-4 ms-auto"
            onClick={nextClickHandler}
          >
            {isVerifying ? 'Verifying...' : 'Select Currency'}
          </LoadingButton>
        </CCardFooter>
      </CForm>
    </CCard>
  )
}

CustomerReview.propTypes = {
  selectedVal: PropTypes.any,
  setForm: PropTypes.func,
  setStep: PropTypes.func,
  step: PropTypes.any,
}

export default CustomerReview
