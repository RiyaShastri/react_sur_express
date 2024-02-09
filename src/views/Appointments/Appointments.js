import React, { useState } from 'react'
import moment from 'moment'

import { CBadge, CButton, CCard, CCardBody, CCardHeader, CForm } from '@coreui/react'
import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { HFAutoComplete, HFDatePicker, StoreSelect, Table } from 'components'

import { cleanObj } from 'utils/Common'
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_OPTIONS } from 'constants/appointment.constants'
import { USER_TYPE } from 'constants/User.constant'
import { appointmentListURL } from 'services/api/routes/appointment'
import { useAuthUser } from 'utils/context/AuthUserContext'

export const getStatusBadgeColor = (status) => {
  if (status === APPOINTMENT_STATUS.COMPLETED) return 'success'
  if (status === APPOINTMENT_STATUS.SCHEDULED) return 'primary'
  return 'primary'
}

const Appointments = () => {
  const tablePopulate = [{ path: 'customerRequestId' }, { path: 'storeId', select: ['name'] }]
  const { authUser, authType } = useAuthUser()

  const initialQuery = { storeId: authUser?.storeId }
  const initialSearch = {
    keys: ['customerRequestId.firstName'],
    value: '',
  }

  // const [searchValue, setSearchValue] = useState('')
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
          {row?.customerRequestId?.first_name} {row?.customerRequestId?.last_name}
        </div>
      ),
    },
    {
      name: 'Mobile',
      minWidth: '130px',
      selector: (row) => <div>{row?.customerRequestId?.mobile}</div>,
    },
    {
      name: 'Email',
      minWidth: '130px',
      selector: (row) => <div>{row?.customerRequestId?.email}</div>,
    },
    {
      name: 'Request Store',
      minWidth: '130px',
      omit: authType !== USER_TYPE.SUPER_ADMIN,
      selector: (row) => <div>{row?.storeId?.name}</div>,
    },
    {
      name: 'Date',
      selector: (row) => <div>{moment(row?.dateTime).format('DD MMM YYYY, h:mm a')}</div>,
    },
    {
      name: 'Status',
      minWidth: '130px',
      selector: (row) => (
        <CBadge color={getStatusBadgeColor(row?.appointmentStatus)}>
          {row?.appointmentStatus}
        </CBadge>
      ),
    },
    // {
    //   name: 'Action',
    //   minWidth: '130px',
    //   selector: (row) => (
    //     <div>
    //       <CTooltip content="View Appointment details">
    //         <CButton
    //           size="sm"
    //           color="primary"
    //           className="rounded-btn-pill"
    //           shape="rounded-pill"
    //           variant="ghost"
    //         >
    //           <CIcon icon={cilColorBorder} size="lg" />
    //         </CButton>
    //       </CTooltip>
    //     </div>
    //   ),
    // },
  ]

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
        // value: searchValue,
      },
    })
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="bg-white d-flex">
          <h4 className="text-primary fw-bold mb-0">Appointments</h4>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <div className="d-flex flex-column flex-md-row gap-3">
              <div className="col-md-11 row">
                {/* <div className="col-md-3">
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
                </div> */}
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
                    handleOnChange={(newValue) =>
                      handleSelectChange(newValue ? new Date(newValue) : undefined, 'dateTime')
                    }
                  />
                </div>
                <div className="col-md-3">
                  <HFAutoComplete
                    id="appointmentStatus"
                    name="appointmentStatus"
                    label="Appointment Status"
                    isController={false}
                    options={APPOINTMENT_STATUS_OPTIONS}
                    defaultValue={queryFilters?.appointmentStatus ?? undefined}
                    handleOnChange={(newValue) =>
                      handleSelectChange(newValue?.value, 'appointmentStatus')
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
            dataURL={appointmentListURL}
            populateValue={tablePopulate}
            // checkEqual={refreshToggle}
            // query={queryFilters}
            filter={filterObj}
            sorting={{
              created_at: 1,
            }}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Appointments
