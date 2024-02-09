import React from 'react'

import { CBadge, CCard, CCardBody, CCardHeader } from '@coreui/react'

import { Table } from 'components'
import { userListURL } from 'services/api/routes/user'
import { USER_STATUS, USER_STATUS_LABEL, USER_TYPE, USER_TYPE_LABEL } from 'constants/User.constant'

const UserList = () => {
  const selectValues = {
    email: 1,
    first_name: 1,
    last_name: 1,
    mobile: 1,
    role: 1,
    status: 1,
  }

  const userTableColumn = [
    {
      name: 'Name',
      minWidth: '130px',
      selector: (row) => (
        <div>
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
      name: 'User Role',
      minWidth: '130px',
      selector: (row) => <div>{USER_TYPE_LABEL[row?.role]}</div>,
    },
    {
      name: 'Status',
      minWidth: '130px',
      selector: (row) => (
        <div>
          <CBadge color={row?.status === USER_STATUS.ACTIVE ? 'success' : 'danger'}>
            {USER_STATUS_LABEL[row?.status]}
          </CBadge>
        </div>
      ),
    },
  ]

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="bg-white">
          <h4 className="text-primary mb-0 fw-bold">Admin Users</h4>
        </CCardHeader>
        <CCardBody>
          <Table
            columns={userTableColumn}
            tableRefresh={true}
            dataURL={userListURL}
            selectValues={selectValues}
            query={{
              role: USER_TYPE.SUPER_ADMIN,
            }}
            sorting={{
              created_at: -1,
            }}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default UserList
