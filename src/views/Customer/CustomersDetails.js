import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormCheck,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { SlQuestion } from 'react-icons/sl'
import { cilCheck, cilColorBorder, cilTrash } from '@coreui/icons'

import Axios from 'services/api/Config'
import { LoadingButton, Spinner, Toast } from 'components'
import {
  deleteCustomerByIDURL,
  getCustomerByIDURL,
  updateCustomerByIDURL,
  verifyCustomerURL,
} from 'services/api/routes/customer'
import { CUSTOMER_DOC_TYPE_LABEL, CUSTOMER_STATUS_LABEL } from 'constants/customer.constant'
import useModulePermissions from 'utils/hooks/useModulePermissions'
import { ROLE_PERMISSIONS } from 'constants/permissions.constants'

const CustomersDetails = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifyLoader, setIsVerifyLoader] = useState(false)
  const [customerDetails, setCustomerDetails] = useState(null)

  const [modelVisible, setModelVisible] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  let { customerId } = useParams()
  const navigate = useNavigate()
  const { permissionCheck } = useModulePermissions()

  const fetch = useCallback(() => {
    setIsLoading(true)
    Axios({ ...getCustomerByIDURL(customerId) })
      .then((response) => {
        const res = response.data.data
        setCustomerDetails(res)
      })
      .catch(() => {
        navigate('/customer')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [customerId, navigate])

  useEffect(() => {
    if (customerId) {
      fetch()
    }
  }, [customerId, fetch])

  const handlePPVChange = (value) => {
    const data = { ppv: value }
    Axios({ ...updateCustomerByIDURL(customerId), data: data })
      .then((res) => {
        Toast.success(res.data.message)
      })
      .finally(() => {
        fetch()
      })
  }

  const handleVerifyCustomer = () => {
    setIsVerifyLoader(true)
    const data = { id: customerId }

    Axios({ ...verifyCustomerURL, data: data })
      .then((res) => {
        Toast.success(res.data.message)
      })
      .finally(() => {
        setIsVerifyLoader(false)
        fetch()
      })
  }

  const handleCustomerDelete = () => {
    setIsDeleteLoading(true)
    Axios({ ...deleteCustomerByIDURL(customerId) })
      .then((res) => {
        navigate('/customer')
        Toast.success(res.data.message)
      })
      .finally(() => {
        setIsDeleteLoading(false)
        setModelVisible(false)
      })
  }

  return (
    <>
      <CCard className="mb-3">
        <CCardHeader className="bg-white d-flex">
          <h4 className="text-primary mb-0 fw-bold">Customer Details</h4>
          {permissionCheck(ROLE_PERMISSIONS.CUSTOMER.CREATE) ? (
            <div className="ms-auto">
              <CButton
                size="sm"
                color="danger"
                onClick={() => setModelVisible(true)}
                className="me-2 text-white"
              >
                <CIcon icon={cilTrash} size="sm" /> Delete Customer
              </CButton>
              <Link to={`/customer/edit/${customerId}`}>
                <CButton size="sm" color="primary">
                  <CIcon icon={cilColorBorder} size="sm" /> Edit Customer
                </CButton>
              </Link>
            </div>
          ) : null}
        </CCardHeader>
        <CCardBody>
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="row g-3">
              <div className="col-md-6">
                <CCard className="">
                  <CCardHeader className="d-flex align-items-center">
                    <span className="text-primary">Basic Details</span>
                    {permissionCheck(ROLE_PERMISSIONS.CUSTOMER.CREATE) ? (
                      <div className="ms-auto">
                        <LoadingButton
                          loading={isVerifyLoader}
                          onClick={handleVerifyCustomer}
                          size="sm"
                          color="primary"
                        >
                          <CIcon icon={cilCheck} size="sm" /> Verify Customer
                        </LoadingButton>
                      </div>
                    ) : null}
                  </CCardHeader>
                  <CCardBody>
                    <div className="mb-3 fw-5">
                      <span className="fw-bold me-2">Customer name:</span>
                      <span>
                        {customerDetails?.first_name} {customerDetails?.last_name}
                      </span>
                    </div>
                    <div className="mb-3 fw-5">
                      <span className="fw-bold me-2">ID:</span>
                      <span>{customerDetails?.IdNumber}</span>
                    </div>
                    <div className="mb-3 fw-5">
                      <span className="fw-bold me-2">Status:</span>
                      <span>
                        <CBadge color={customerDetails?.verified ? 'success' : 'danger'}>
                          {customerDetails?.verified
                            ? CUSTOMER_STATUS_LABEL.VERIFIED
                            : CUSTOMER_STATUS_LABEL.UN_VERIFIED}
                        </CBadge>
                      </span>
                    </div>
                    <div className="mb-3 fw-5">
                      <span className="fw-bold me-2">Phone:</span>
                      <span>{customerDetails?.phone}</span>
                    </div>
                    <div className="mb-3 fw-5">
                      <span className="fw-bold me-2">Email:</span>
                      <span>{customerDetails?.email}</span>
                    </div>
                    <div className="mb-3 fw-5">
                      <span className="fw-bold me-2">Date of Birth:</span>
                      <span>{moment(customerDetails?.dob).format('DD-MMM-YYYY')}</span>
                    </div>
                    <div className="mb-3 fw-5">
                      <span className="fw-bold me-2">Profession:</span>
                      <span>{customerDetails?.profession}</span>
                    </div>
                    <div className="mb-3 fw-5 d-flex ">
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
                          checked={customerDetails?.ppv}
                          disabled={!permissionCheck(ROLE_PERMISSIONS.CUSTOMER.CREATE)}
                          onChange={(_) => handlePPVChange(_.target.checked)}
                        />
                      </span>
                    </div>
                  </CCardBody>
                </CCard>
              </div>
              <div className="col-md-6">
                <CCard className="mb-3">
                  <CCardHeader>
                    <div className="text-primary">Customer Address</div>
                  </CCardHeader>
                  <CCardBody>
                    <div className="row">
                      <div className="col-md-6 mb-3 fw-5">
                        <span className="fw-bold me-2">Address 1:</span>
                        <span>{customerDetails?.address_line_1}</span>
                      </div>
                      <div className="col-md-6 mb-3 fw-5">
                        {customerDetails?.address_line_2 !== '' && (
                          <>
                            <span className="fw-bold me-2">Address 2:</span>
                            <span>{customerDetails?.address_line_2}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3 fw-5">
                        <span className="fw-bold me-2">Country:</span>
                        <span>
                          <img
                            loading="lazy"
                            width="20"
                            src={`https://flagcdn.com/h24/${customerDetails?.countryDetails?.code?.toLowerCase()}.png`}
                            alt={`${customerDetails?.countryDetails?.name} flag`}
                          />{' '}
                          {customerDetails?.countryDetails?.name}
                        </span>
                      </div>
                      <div className="col-md-6 mb-3 fw-5">
                        <span className="fw-bold me-2">Province:</span>
                        <span>{customerDetails?.provinceDetails?.name}</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3 fw-5">
                        <span className="fw-bold me-2">City:</span>
                        <span>{customerDetails?.cityDetails?.name}</span>
                      </div>
                      <div className="col-md-6 mb-3 fw-5">
                        <span className="fw-bold me-2">Zip code:</span>
                        <span>{customerDetails?.postal_code}</span>
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
                <CCard className="">
                  <CCardHeader>
                    <div className="text-primary">Documents Details</div>
                  </CCardHeader>
                  <CCardBody>
                    {customerDetails?.identityDocs?.map((doc, i) => {
                      return (
                        <div className="mb-3 fw-5" key={i}>
                          <span className="fw-bold me-2">
                            {CUSTOMER_DOC_TYPE_LABEL[doc?.type]}:
                          </span>
                          <span>{doc?.value}</span>
                        </div>
                      )
                    })}
                  </CCardBody>
                </CCard>
              </div>
            </div>
          )}
        </CCardBody>
      </CCard>

      <CModal alignment="center" visible={modelVisible} onClose={() => setModelVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete Customer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete {customerDetails?.first_name} {customerDetails?.last_name}{' '}
          as Customer?
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" variant="outline" onClick={() => setModelVisible(false)}>
            Close
          </CButton>
          <LoadingButton
            className="text-white"
            loading={isDeleteLoading}
            onClick={handleCustomerDelete}
            color="danger"
          >
            Delete
          </LoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default CustomersDetails
