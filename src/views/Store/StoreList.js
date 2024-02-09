import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { SlEye } from 'react-icons/sl'
import { cilLockLocked, cilLockUnlocked, cilColorBorder, cilPlus, cilSearch } from '@coreui/icons'

import Axios from 'services/api/Config'
import {
  CitySelect,
  CountrySelect,
  HFTextField,
  LoadingButton,
  ProvinceSelect,
  Table,
  Toast,
} from 'components'
import { storeListURL, updateStoreByIDURL } from 'services/api/routes/store'
import { STORE_STATUS_LABEL, STORE_STATUS } from 'constants/Store.constant'
import { cleanObj } from 'utils/Common'
import useModulePermissions from 'utils/hooks/useModulePermissions'
import { ROLE_PERMISSIONS } from 'constants/permissions.constants'
import { useAuthUser } from 'utils/context/AuthUserContext'
import { USER_TYPE } from 'constants/User.constant'

const StoreList = () => {
  const { authUser, authType } = useAuthUser()
  const tablePopulate = [
    { path: 'countryDetails' },
    { path: 'provinceDetails' },
    { path: 'cityDetails' },
  ]
  const initialQuery = {
    _id: authType === USER_TYPE.SUPER_ADMIN ? undefined : authUser?.storeId,
  }
  const initialSearch = {
    keys: ['name'],
    value: '',
  }

  const [searchValue, setSearchValue] = useState('')
  const [queryFilters, setQueryFilters] = useState(initialQuery)
  const [filterObj, setFilterObj] = useState({
    query: initialQuery,
    search: initialSearch,
  })

  const [refreshToggle, setRefreshToggle] = useState(false)
  const [modelVisible, setModelVisible] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { permissionCheck } = useModulePermissions()

  const renderFlagImage = (row) => {
    const countryCode = row?.countryDetails?.code?.toLowerCase()
    const imageUrl = `https://flagcdn.com/h24/${countryCode}.png`
    const altText = `${row?.countryDetails?.name} flag`

    return (
      <div>
        <img loading="lazy" width="20" src={imageUrl} alt={altText} /> {row?.countryDetails?.name}
      </div>
    )
  }

  const renderLockIcon = (row) => {
    const lockIcon = row?.status !== STORE_STATUS.ACTIVE ? cilLockUnlocked : cilLockLocked
    return <CIcon icon={lockIcon} size="lg" />
  }

  const storeTableColumn = [
    {
      name: 'Store Name',
      minWidth: '180px',
      selector: (row) => (
        <div className="py-2">
          <Link to={`/store/view/${row?._id}`}>{row?.name}</Link>
        </div>
      ),
    },
    {
      name: 'City',
      minWidth: '130px',
      selector: (row) => <div>{row?.cityDetails?.name}</div>,
    },
    {
      name: 'Province',
      minWidth: '130px',
      selector: (row) => <div>{row?.provinceDetails?.name}</div>,
    },
    {
      name: 'Country',
      minWidth: '180px',
      selector: (row) => renderFlagImage(row),
    },
    {
      name: 'Status',
      minWidth: '130px',
      selector: (row) => (
        <CBadge color={row?.status === STORE_STATUS.ACTIVE ? 'success' : 'danger'}>
          {STORE_STATUS_LABEL[row?.status]}
        </CBadge>
      ),
    },
    {
      name: 'Action',
      minWidth: '130px',
      right: true,
      selector: (row) => (
        <div>
          {permissionCheck(ROLE_PERMISSIONS.STORE.CREATE) && (
            <CTooltip content={`${getStoreStatusLabel(row)} Store`}>
              <CButton
                size="sm"
                color="primary"
                shape="rounded-pill"
                variant="ghost"
                className="rounded-btn-pill"
                onClick={() => setModelVisible(row)}
              >
                {renderLockIcon(row)}
              </CButton>
            </CTooltip>
          )}
          <CTooltip content="View Store details">
            <Link to={`/store/view/${row?._id}`} className="ms-2">
              <CButton
                size="sm"
                color="primary"
                className="rounded-btn-pill"
                shape="rounded-pill"
                variant="ghost"
              >
                <SlEye className="fs-5" />
              </CButton>
            </Link>
          </CTooltip>
          {permissionCheck(ROLE_PERMISSIONS.STORE.CREATE) && (
            <CTooltip content="Edit Store">
              <Link to={`/store/edit/${row?._id}`} className="ms-2">
                <CButton
                  size="sm"
                  color="primary"
                  className="rounded-btn-pill"
                  shape="rounded-pill"
                  variant="ghost"
                >
                  <CIcon icon={cilColorBorder} size="lg" />
                </CButton>
              </Link>
            </CTooltip>
          )}
        </div>
      ),
    },
  ]

  const handleSelectChange = (value, field) => {
    let tobj = { ...queryFilters }

    if (value) {
      tobj[field] = value
    } else {
      if (field === 'countryId') {
        delete tobj.cityId
        delete tobj.provinceId
      }
      if (field === 'provinceId') {
        delete tobj.cityId
      }
      delete tobj[field]
    }
    setQueryFilters(tobj)
  }

  const getStoreStatusLabel = (obj) => {
    return obj?.status !== STORE_STATUS.ACTIVE
      ? STORE_STATUS_LABEL.ACTIVE
      : STORE_STATUS_LABEL.DEACTIVATED
  }

  const handleStoreUpdate = () => {
    setIsLoading(true)
    const data = {
      status:
        modelVisible?.status === STORE_STATUS.ACTIVE
          ? STORE_STATUS.DEACTIVATED
          : STORE_STATUS.ACTIVE,
    }

    Axios({ ...updateStoreByIDURL(modelVisible?._id), data: data })
      .then((res) => {
        Toast.success(res.data.message)
      })
      .finally(() => {
        setIsLoading(false)
        setModelVisible(null)
        setRefreshToggle((prev) => !prev)
      })
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
          <h4 className="text-primary fw-bold mb-0">Stores</h4>
          {permissionCheck(ROLE_PERMISSIONS.STORE.CREATE) ? (
            <div className="ms-auto">
              <Link to="/store/add">
                <CButton size="sm" color="primary">
                  <CIcon icon={cilPlus} size="sm" /> Add Store
                </CButton>
              </Link>
            </div>
          ) : null}
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
                    label="Store Name"
                    isController={false}
                    value={searchValue}
                    handleOnChange={(val) => {
                      setSearchValue(val)
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <CountrySelect
                    label="Country"
                    defaultValue={queryFilters?.countryId ?? undefined}
                    handleOnChange={(newValue) =>
                      handleSelectChange(newValue?.countryId, 'countryId')
                    }
                  />
                </div>
                <div className="col-md-3">
                  <ProvinceSelect
                    label="Province"
                    countryCode={queryFilters?.countryId ?? undefined}
                    defaultValue={queryFilters?.provinceId ?? undefined}
                    handleOnChange={(newValue) => handleSelectChange(newValue?._id, 'provinceId')}
                  />
                </div>
                <div className="col-md-3">
                  <CitySelect
                    label="City"
                    countryCode={queryFilters?.countryId ?? undefined}
                    provinceCode={queryFilters?.provinceId ?? undefined}
                    defaultValue={queryFilters?.cityId ?? undefined}
                    handleOnChange={(newValue) => handleSelectChange(newValue?.cityId, 'cityId')}
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
            dataURL={storeListURL}
            populateValue={tablePopulate}
            checkEqual={refreshToggle}
            // query={queryFilters}
            filter={filterObj}
            sorting={{
              name: 1,
            }}
          />
        </CCardBody>
      </CCard>

      <CModal alignment="center" visible={!!modelVisible} onClose={() => setModelVisible(null)}>
        <CModalHeader>
          <CModalTitle>{`${getStoreStatusLabel(modelVisible)} Store`}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to {getStoreStatusLabel(modelVisible)} the Store?
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" variant="outline" onClick={() => setModelVisible(null)}>
            Close
          </CButton>
          <LoadingButton loading={isLoading} onClick={handleStoreUpdate} color="primary">
            Okay
          </LoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default StoreList
