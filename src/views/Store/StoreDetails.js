import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilColorBorder, cilLockLocked, cilLockUnlocked } from '@coreui/icons'

import Axios from 'services/api/Config'
import { LoadingButton, Spinner, Toast } from 'components'
import { USER_TYPE } from 'constants/User.constant'
import { getStoreByIDURL, updateStoreByIDURL } from 'services/api/routes/store'
import { STORE_STATUS, STORE_STATUS_LABEL } from 'constants/Store.constant'
import { ROLE_PERMISSIONS } from 'constants/permissions.constants'
import useModulePermissions from 'utils/hooks/useModulePermissions'

import StoreUserTable from './StoreComponents/StoreUserTable'
import StoreTransactionTable from './StoreComponents/StoreTransactionTable'

const StoreDetails = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [storeDetails, setStoreDetails] = useState(null)
  const [activeTab, setActiveTab] = useState(1)

  const [modelVisible, setModelVisible] = useState(false)
  const [isStateLoading, setIsStateLoading] = useState(false)

  let { storeId } = useParams()
  const navigate = useNavigate()
  const { permissionCheck } = useModulePermissions()

  const fetch = useCallback(() => {
    setIsLoading(true)
    Axios({ ...getStoreByIDURL(storeId) })
      .then((response) => {
        const res = response.data.data
        setStoreDetails(res)
      })
      .catch(() => {
        navigate('/store')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [navigate, storeId])

  useEffect(() => {
    if (storeId) {
      fetch()
    }
  }, [fetch, storeId])

  const getStoreStatusLabel = (obj) => {
    return obj?.status !== STORE_STATUS.ACTIVE
      ? STORE_STATUS_LABEL.ACTIVE
      : STORE_STATUS_LABEL.DEACTIVATED
  }

  const handleStoreUpdate = () => {
    setIsStateLoading(true)
    const data = {
      status:
        storeDetails?.status === STORE_STATUS.ACTIVE
          ? STORE_STATUS.DEACTIVATED
          : STORE_STATUS.ACTIVE,
    }

    Axios({ ...updateStoreByIDURL(storeId), data: data })
      .then((res) => {
        Toast.success(res.data.message)
      })
      .finally(() => {
        setIsStateLoading(false)
        setModelVisible(false)
        fetch()
      })
  }

  return (
    <>
      <CCard className="mb-3">
        <CCardHeader className="bg-white d-flex">
          <h4 className="text-primary mb-0 fw-bold">Store Details</h4>
          {permissionCheck(ROLE_PERMISSIONS.STORE.CREATE) ? (
            <div className="ms-auto">
              <Link to={`/store/edit/${storeId}`}>
                <CButton size="sm" color="primary">
                  <CIcon icon={cilColorBorder} size="sm" /> Edit Store
                </CButton>
              </Link>
            </div>
          ) : null}
        </CCardHeader>
        <CCardBody>
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="row row-cols-1 row-cols-md-2 g-4">
              <div className="col">
                <CCard className="h-100">
                  <CCardHeader className="d-flex align-items-center">
                    <div className="text-primary">Basic Details</div>
                    {permissionCheck(ROLE_PERMISSIONS.STORE.CREATE) ? (
                      <div className="ms-auto">
                        <CButton onClick={() => setModelVisible(true)} size="sm" color="primary">
                          {storeDetails?.status !== STORE_STATUS.ACTIVE ? (
                            <CIcon icon={cilLockUnlocked} size="sm" />
                          ) : (
                            <CIcon icon={cilLockLocked} size="sm" />
                          )}
                          {` ${getStoreStatusLabel(storeDetails)} Store`}
                        </CButton>
                      </div>
                    ) : null}
                  </CCardHeader>
                  <CCardBody>
                    <div className="mb-3 fw-5">
                      <span className="fw-bold me-2">Store name:</span>
                      <span>{storeDetails?.name}</span>
                    </div>
                    <div className="mb-3 fw-5">
                      <span className="fw-bold me-2">Status:</span>
                      <span>
                        <CBadge
                          color={
                            storeDetails?.status === STORE_STATUS.ACTIVE ? 'success' : 'danger'
                          }
                        >
                          {STORE_STATUS_LABEL[storeDetails?.status]}
                        </CBadge>
                      </span>
                    </div>
                  </CCardBody>
                </CCard>
              </div>
              <div className="col">
                <CCard className="h-100">
                  <CCardHeader>
                    <div className="text-primary">Store Address</div>
                  </CCardHeader>
                  <CCardBody>
                    <div className="row">
                      <div className="col-md-6 mb-3 fw-5">
                        <span className="fw-bold me-2">Address 1:</span>
                        <span>{storeDetails?.address_line_1}</span>
                      </div>
                      <div className="col-md-6 mb-3 fw-5">
                        {storeDetails?.address_line_2 !== '' && (
                          <>
                            <span className="fw-bold me-2">Address 2:</span>
                            <span>{storeDetails?.address_line_2}</span>
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
                            src={`https://flagcdn.com/h24/${storeDetails?.countryDetails?.code?.toLowerCase()}.png`}
                            alt={`${storeDetails?.countryDetails?.name} flag`}
                          />{' '}
                          {storeDetails?.countryDetails?.name}
                        </span>
                      </div>
                      <div className="col-md-6 mb-3 fw-5">
                        <span className="fw-bold me-2">Province:</span>
                        <span>{storeDetails?.provinceDetails?.name}</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3 fw-5">
                        <span className="fw-bold me-2">City:</span>
                        <span>{storeDetails?.cityDetails?.name}</span>
                      </div>
                      <div className="col-md-6 mb-3 fw-5">
                        <span className="fw-bold me-2">Zip code:</span>
                        <span>{storeDetails?.zipcode}</span>
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </div>
            </div>
          )}
        </CCardBody>
      </CCard>

      {!isLoading && permissionCheck(ROLE_PERMISSIONS.USERS.VIEW) ? (
        <CCard className="mb-4">
          <CCardBody>
            <CNav variant="tabs" role="tabList">
              <CNavItem>
                <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
                  Store Admin
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)}>
                  Store Operators
                </CNavLink>
              </CNavItem>
              {permissionCheck(ROLE_PERMISSIONS.STORE_TRANSACTION.VIEW) ? (
                <CNavItem>
                  <CNavLink active={activeTab === 3} onClick={() => setActiveTab(3)}>
                    Transactions
                  </CNavLink>
                </CNavItem>
              ) : null}
            </CNav>
            <CTabContent>
              <CTabPane role="tabpanel" aria-labelledby="Store Admin Tab" visible={activeTab === 1}>
                {activeTab === 1 && <StoreUserTable type={USER_TYPE.STORE_ADMIN} />}
              </CTabPane>
              <CTabPane
                role="tabpanel"
                aria-labelledby="Store Operators Tab"
                visible={activeTab === 2}
              >
                {activeTab === 2 && <StoreUserTable type={USER_TYPE.STORE_OPERATOR} />}
              </CTabPane>
              <CTabPane
                role="tabpanel"
                aria-labelledby="Store Transaction Tab"
                visible={activeTab === 3}
              >
                {activeTab === 3 && <StoreTransactionTable />}
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      ) : null}

      <CModal alignment="center" visible={modelVisible} onClose={() => setModelVisible(false)}>
        <CModalHeader>
          <CModalTitle>{`${getStoreStatusLabel(storeDetails)} Store`}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to {getStoreStatusLabel(storeDetails)} the Store?
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" variant="outline" onClick={() => setModelVisible(false)}>
            Close
          </CButton>
          <LoadingButton loading={isStateLoading} onClick={handleStoreUpdate} color="primary">
            Okay
          </LoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default StoreDetails
