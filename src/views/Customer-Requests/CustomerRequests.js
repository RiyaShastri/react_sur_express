import React, { useState } from 'react'
import moment from 'moment'

import { CBadge, CButton, CCard, CCardBody, CCardHeader, CForm, CTooltip } from '@coreui/react'
import { cilColorBorder, cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { HFAutoComplete, HFDatePicker, HFTextField, StoreSelect, Table } from 'components'

import { cleanObj } from 'utils/Common'
import {
  CUSTOMER_REQUEST_STATUS,
  CUSTOMER_REQUEST_STATUS_OPTIONS,
} from 'constants/customer-request.constants'
import { USER_TYPE } from 'constants/User.constant'
import { customerRequestListURL } from 'services/api/routes/customer-request'
import { useAuthUser } from 'utils/context/AuthUserContext'
import UpdateAppointmentStatusModel from './CRComponents/UpdateAppointmentStatusModel'

export const getStatusBadgeColor = (status) => {
  if (status === CUSTOMER_REQUEST_STATUS.APPROVE) return 'success'
  if (status === CUSTOMER_REQUEST_STATUS.REJECT) return 'danger'
  return 'primary'
}

const CustomerRequests = () => {
  const tablePopulate = [{ path: 'storeId' }]
  const { authUser, authType } = useAuthUser()

  const initialQuery = { storeId: authUser?.storeId }
  const initialSearch = {
    keys: ['name'],
    value: '',
  }

  const [searchValue, setSearchValue] = useState('')
  const [statusUpdateModel, setStatusUpdateModel] = useState(null)
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [queryFilters, setQueryFilters] = useState(initialQuery)
  const [filterObj, setFilterObj] = useState({
    query: initialQuery,
    search: initialSearch,
  })
  const storeTableColumn = [
    {
      name: 'Customer Name',
      minWidth: '180px',
      selector: (row) => (
        <div className="py-2">
          {row?.first_name} {row?.last_name}
        </div>
      ),
    },
    {
      name: 'Mobile',
      minWidth: '130px',
      selector: (row) => <div>{row?.mobile}</div>,
    },
    {
      name: 'Email',
      minWidth: '130px',
      selector: (row) => <div>{row?.email}</div>,
    },
    {
      name: 'Request Store',
      minWidth: '130px',
      omit: authType !== USER_TYPE.SUPER_ADMIN,
      selector: (row) => <div>{row?.storeId?.name}</div>,
    },
    {
      name: 'Date',
      selector: (row) => <div>{moment(row?.scheduleDate).format('DD MMM YYYY, h:mm a')}</div>,
    },
    {
      name: 'Status',
      minWidth: '130px',
      selector: (row) => (
        <CBadge color={getStatusBadgeColor(row?.requestStatus)}>{row?.requestStatus}</CBadge>
      ),
    },
    {
      name: 'Action',
      minWidth: '130px',
      selector: (row) => (
        <div>
          {row?.requestStatus !== CUSTOMER_REQUEST_STATUS.REJECT ? (
            <CTooltip content="View Appointment details">
              <CButton
                size="sm"
                color="primary"
                className="rounded-btn-pill"
                shape="rounded-pill"
                variant="ghost"
                onClick={() => handleStatusUpdateModelOpen(row)}
              >
                <CIcon icon={cilColorBorder} size="lg" />
              </CButton>
            </CTooltip>
          ) : null}
        </div>
      ),
    },
  ]

  const handleStatusUpdateModelOpen = (row) => {
    setStatusUpdateModel(row)
  }

  const handleStatusUpdateModelClose = () => {
    setStatusUpdateModel(null)
  }

  const handleSelectChange = (value, field) => {
    let tobj = { ...queryFilters }

    if (value) {
      tobj[field] = value
    } else {
      delete tobj[field]
    }
    setQueryFilters(tobj)
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    setFilterObj({
      query: cleanObj(queryFilters),
      search: {
        ...initialSearch,
        value: searchValue,
      },
    })
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="bg-white d-flex">
          <h4 className="text-primary fw-bold mb-0">Customer Requests</h4>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <div className="d-flex flex-column flex-md-row gap-3">
              <div className="col-md-11 row">
                <div className="col-md-3">
                  <HFTextField
                    id="name"
                    name="name"
                    placeholder="Search..."
                    label="Customer Name"
                    isController={false}
                    value={searchValue}
                    handleOnChange={(val) => {
                      setSearchValue(val)
                    }}
                  />
                </div>
                {authType === USER_TYPE.SUPER_ADMIN && (
                  <div className="col-md-3">
                    <StoreSelect
                      label="Store"
                      defaultValue={queryFilters?.storeId ?? undefined}
                      handleOnChange={(newValue) => handleSelectChange(newValue?._id, 'storeId')}
                    />
                  </div>
                )}
                <div className="col-md-3">
                  <HFDatePicker
                    id="dateTime"
                    name="dateTime"
                    label="Date"
                    isController={false}
                    defaultValue={queryFilters?.dateTime ?? undefined}
                    handleOnChange={(newValue) => handleSelectChange(newValue, 'dateTime')}
                  />
                </div>
                <div className="col-md-3">
                  <HFAutoComplete
                    id="requestStatus"
                    name="requestStatus"
                    label="Request Status"
                    isController={false}
                    options={CUSTOMER_REQUEST_STATUS_OPTIONS}
                    defaultValue={queryFilters?.requestStatus ?? undefined}
                    handleOnChange={(newValue) =>
                      handleSelectChange(newValue?.value, 'requestStatus')
                    }
                  />
                </div>
              </div>
              <div className="align-self-end mb-3 w-100">
                <CButton color="primary" type="submit" className="w-100" onClick={handleSubmit}>
                  <CIcon icon={cilSearch} /> Search
                </CButton>
              </div>
            </div>
          </CForm>

          <Table
            columns={storeTableColumn}
            tableRefresh={true}
            dataURL={customerRequestListURL}
            populateValue={tablePopulate}
            checkEqual={refreshToggle}
            // query={queryFilters}
            filter={filterObj}
            sorting={{
              created_at: 1,
            }}
          />
        </CCardBody>
      </CCard>

      {!!statusUpdateModel && (
        <UpdateAppointmentStatusModel
          statusUpdateModel={statusUpdateModel}
          setStatusUpdateModel={setStatusUpdateModel}
          onClose={handleStatusUpdateModelClose}
          setRefreshToggle={setRefreshToggle}
        />
      )}
    </>
  )
}

export default CustomerRequests
