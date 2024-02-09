import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import {
  CBadge,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilColorBorder, cilLockLocked, cilLockUnlocked, cilPlus } from '@coreui/icons'

import Axios from 'services/api/Config'
import { HFTextField, LoadingButton, Table, Toast } from 'components'
import { updateUserByIDURL, userListURL } from 'services/api/routes/user'
import { USER_STATUS, USER_STATUS_LABEL, USER_TYPE_LABEL } from 'constants/User.constant'

import UserAddEditModel from './UserAddEditModel'
import useModulePermissions from 'utils/hooks/useModulePermissions'
import { ROLE_PERMISSIONS } from 'constants/permissions.constants'

const StoreUserTable = ({ type }) => {
  let { storeId } = useParams()
  const selectValues = {
    email: 1,
    first_name: 1,
    last_name: 1,
    mobile: 1,
    role: 1,
    status: 1,
  }

  const initialQuery = { role: type, storeId: storeId }
  const initialSearch = {
    keys: ['first_name', 'last_name'],
    value: '',
  }
  const initialFilterObj = {
    query: initialQuery,
    search: initialSearch,
  }

  const { permissionCheck } = useModulePermissions()

  const [searchValue, setSearchValue] = useState('')
  const [filterObj, setFilterObj] = useState(initialFilterObj)

  const [isEdit, setIsEdit] = useState(false)
  const [rowValue, setRowValue] = useState(null)
  const [addEditModel, setAddEditModel] = useState(false)
  const [refreshToggle, setRefreshToggle] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [modelVisible, setModelVisible] = useState(null)

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
    {
      name: 'Action',
      minWidth: '130px',
      right: true,
      selector: (row) => (
        <div>
          {permissionCheck(ROLE_PERMISSIONS.USERS.CREATE) ? (
            <>
              <CTooltip content={`${getUserStatusLabel(row)} User`}>
                <CButton
                  size="sm"
                  color="primary"
                  shape="rounded-pill"
                  variant="ghost"
                  onClick={() => setModelVisible(row)}
                  className="rounded-btn-pill"
                >
                  {row?.status !== USER_STATUS.ACTIVE ? (
                    <CIcon icon={cilLockUnlocked} size="lg" />
                  ) : (
                    <CIcon icon={cilLockLocked} size="lg" />
                  )}
                </CButton>
              </CTooltip>
              <CTooltip content="Edit User">
                <CButton
                  size="sm"
                  color="primary"
                  className="rounded-btn-pill"
                  shape="rounded-pill"
                  variant="ghost"
                  onClick={() => handleAddEditModelOpen(row)}
                >
                  <CIcon icon={cilColorBorder} size="lg" />
                </CButton>
              </CTooltip>
            </>
          ) : null}
        </div>
      ),
    },
  ]

  const getUserStatusLabel = (obj) => {
    return obj?.status !== USER_STATUS.ACTIVE
      ? USER_STATUS_LABEL.ACTIVE
      : USER_STATUS_LABEL.DEACTIVATED
  }

  const handleAddEditModelOpen = (value = false) => {
    setAddEditModel(true)
    if (value) {
      setIsEdit(true)
      setRowValue(value)
    }
  }

  const handleAddEditModelClose = () => {
    setAddEditModel(null)
    if (isEdit) {
      setIsEdit(false)
      setRowValue(null)
    }
    setRefreshToggle((prev) => !prev)
  }

  const handleUserUpdate = () => {
    setIsLoading(true)
    const data = {
      status:
        modelVisible?.status === USER_STATUS.ACTIVE ? USER_STATUS.DEACTIVATED : USER_STATUS.ACTIVE,
    }

    Axios({ ...updateUserByIDURL(modelVisible?._id), data: data })
      .then((res) => {
        Toast.success(res.data.message)
      })
      .finally(() => {
        setIsLoading(false)
        setModelVisible(null)
        setRefreshToggle((prev) => !prev)
      })
  }

  const handleChange = (val) => {
    setSearchValue(val)

    setFilterObj({
      query: initialQuery,
      search: {
        ...initialSearch,
        value: val,
      },
    })
  }

  return (
    <>
      <div className="mt-3">
        <div className="d-flex justify-content-between">
          <div className="col-md-3">
            <HFTextField
              id="name"
              name="name"
              placeholder="Search..."
              label="User Name"
              isController={false}
              value={searchValue}
              handleOnChange={(val) => {
                handleChange(val)
              }}
            />
          </div>
          {permissionCheck(ROLE_PERMISSIONS.USERS.CREATE) ? (
            <div className="align-self-end mb-3">
              <CButton size="sm" color="primary" onClick={() => handleAddEditModelOpen(false)}>
                <CIcon icon={cilPlus} /> Add User
              </CButton>
            </div>
          ) : null}
        </div>

        <Table
          columns={userTableColumn}
          tableRefresh={true}
          dataURL={userListURL}
          checkEqual={refreshToggle}
          selectValues={selectValues}
          filter={filterObj}
          sorting={{
            first_name: -1,
          }}
        />
      </div>

      <UserAddEditModel
        isEdit={isEdit}
        isVisible={addEditModel}
        rowValue={rowValue}
        onClose={handleAddEditModelClose}
      />

      <CModal alignment="center" visible={!!modelVisible} onClose={() => setModelVisible(null)}>
        <CModalHeader>
          <CModalTitle>{`${getUserStatusLabel(modelVisible)} User`}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to {getUserStatusLabel(modelVisible)} the User?
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" variant="outline" onClick={() => setModelVisible(null)}>
            Close
          </CButton>
          <LoadingButton loading={isLoading} onClick={handleUserUpdate} color="primary">
            Okay
          </LoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

StoreUserTable.propTypes = {
  type: PropTypes.any,
}

export default StoreUserTable
