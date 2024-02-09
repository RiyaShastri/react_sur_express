import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormCheck,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { SlEye, SlQuestion } from 'react-icons/sl'
import { cilColorBorder, cilPlus, cilSearch, cilTrash } from '@coreui/icons'

import {
  CitySelect,
  CountrySelect,
  HFTextField,
  LoadingButton,
  ProvinceSelect,
  Table,
  Toast,
} from 'components'

import Axios from 'services/api/Config'
import { cleanObj } from 'utils/Common'
import { CUSTOMER_STATUS_LABEL } from 'constants/customer.constant'
import { customerListURL, deleteCustomerByIDURL } from 'services/api/routes/customer'
import useModulePermissions from 'utils/hooks/useModulePermissions'
import { ROLE_PERMISSIONS } from 'constants/permissions.constants'

const CustomerList = () => {
  const tablePopulate = [
    {
      path: 'countryDetails',
    },
    {
      path: 'provinceDetails',
    },
    {
      path: 'cityDetails',
    },
  ]
  const initialQuery = {}
  const initialSearch = {
    keys: ['name', 'phone'],
    value: '',
  }
  const { permissionCheck } = useModulePermissions()

  const [searchValue, setSearchValue] = useState('')
  const [queryFilters, setQueryFilters] = useState(initialQuery)
  const [filterObj, setFilterObj] = useState({
    query: initialQuery,
    search: initialSearch,
  })

  const [refreshToggle, setRefreshToggle] = useState(false)
  const [modelVisible, setModelVisible] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const customerTableColumn = [
    {
      name: 'ID',
      minWidth: '120px',
      selector: (row) => <div>{row?.IdNumber}</div>,
    },
    {
      name: 'Customer Name',
      minWidth: '180px',
      selector: (row) => (
        <div className="py-2">
          <Link to={`/customer/view/${row?._id}`} className="ms-2">
            {row?.first_name} {row?.last_name}
          </Link>
        </div>
      ),
    },
    {
      name: 'Phone',
      minWidth: '140px',
      selector: (row) => <div>{row?.phone}</div>,
    },
    {
      name: 'Email',
      minWidth: '180px',
      selector: (row) => <div>{row?.email}</div>,
    },
    {
      name: 'Profession',
      minWidth: '180px',
      selector: (row) => <div>{row?.profession}</div>,
    },
    {
      name: (
        <div>
          <CTooltip content="Politically Vulnerable Person">
            <div>
              PPV <SlQuestion />
            </div>
          </CTooltip>
        </div>
      ),
      minWidth: '100px',
      selector: (row) => (
        <div>
          <CFormCheck checked={row?.ppv} readOnly={true} disabled={true} />
        </div>
      ),
    },
    {
      name: 'DOB',
      minWidth: '130px',
      selector: (row) => <div>{moment(row?.dob).format('DD-MMM-YYYY')}</div>,
    },
    {
      name: 'City',
      minWidth: '120px',
      selector: (row) => <div>{row?.cityDetails?.name}</div>,
    },
    {
      name: 'Province',
      minWidth: '120px',
      selector: (row) => <div>{row?.provinceDetails?.name}</div>,
    },
    {
      name: 'Country',
      minWidth: '150px',
      selector: (row) => (
        <div>
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/h24/${row?.countryDetails?.code?.toLowerCase()}.png`}
            alt={`${row?.countryDetails?.name} flag`}
          />{' '}
          {row?.countryDetails?.name}
        </div>
      ),
    },
    {
      name: 'Status',
      minWidth: '130px',
      selector: (row) => (
        <div>
          <CBadge color={row?.verified ? 'success' : 'danger'}>
            {row?.verified ? CUSTOMER_STATUS_LABEL.VERIFIED : CUSTOMER_STATUS_LABEL.UN_VERIFIED}
          </CBadge>
        </div>
      ),
    },
    {
      name: 'Action',
      minWidth: '180px',
      // maxWidth: '130px',
      right: true,
      selector: (row) => (
        <div>
          <CTooltip content="View Customer details">
            <Link to={`/customer/view/${row?._id}`} className="ms-2">
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
          {permissionCheck(ROLE_PERMISSIONS.CUSTOMER.CREATE) ? (
            <CTooltip content="Edit Customer">
              <Link to={`/customer/edit/${row?._id}`} className="ms-2">
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
          ) : null}
          {permissionCheck(ROLE_PERMISSIONS.CUSTOMER.CREATE) ? (
            <CTooltip content="Delete Customer">
              <CButton
                size="sm"
                color="danger"
                className="rounded-btn-pill ms-2"
                shape="rounded-pill"
                variant="ghost"
                onClick={() => setModelVisible(row)}
              >
                <CIcon icon={cilTrash} size="lg" />
              </CButton>
            </CTooltip>
          ) : null}
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
        delete tobj?.cityId
        delete tobj?.provinceId
      }
      if (field === 'provinceId') {
        delete tobj?.cityId
      }
      delete tobj[field]
    }
    setQueryFilters(tobj)
  }

  const handleCustomerDelete = () => {
    setIsLoading(true)
    Axios({ ...deleteCustomerByIDURL(modelVisible?._id) })
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
          <h4 className="text-primary fw-bold mb-0">Customers</h4>
          {permissionCheck(ROLE_PERMISSIONS.CUSTOMER.CREATE) ? (
            <div className="ms-auto">
              <Link to="/customer/add">
                <CButton size="sm" color="primary">
                  <CIcon icon={cilPlus} size="sm" /> Add Customer
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
                    label="Search"
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
            dataURL={customerListURL}
            columns={customerTableColumn}
            populateValue={tablePopulate}
            checkEqual={refreshToggle}
            filter={filterObj}
            tableRefresh={true}
            sorting={{ name: 1 }}
          />
        </CCardBody>
      </CCard>

      <CModal alignment="center" visible={!!modelVisible} onClose={() => setModelVisible(null)}>
        <CModalHeader>
          <CModalTitle>Delete Customer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete {modelVisible?.first_name} {modelVisible?.last_name} as
          Customer?
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" variant="outline" onClick={() => setModelVisible(null)}>
            Close
          </CButton>
          <LoadingButton
            className="text-white"
            loading={isLoading}
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

export default CustomerList
