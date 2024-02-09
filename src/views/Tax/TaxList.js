import React, { useState } from 'react'

import {
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
import { cilColorBorder, cilPlus, cilSearch, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CountrySelect, LoadingButton, ProvinceSelect, Table, Toast } from 'components'
import { cleanObj } from 'utils/Common'
import { deleteTaxByIDURL, taxListURL } from 'services/api/routes/tax'
import TaxAddEditModel from './TaxAddEditModel'
import Axios from 'services/api/Config'

const TaxList = () => {
  const tablePopulate = [
    {
      path: 'countryDetails',
    },
    {
      path: 'provinceDetails',
    },
  ]

  const [queryFilters, setQueryFilters] = useState({})
  const [filterObj, setFilterObj] = useState({ query: {} })

  const [addEditModel, setAddEditModel] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [rowValue, setRowValue] = useState(null)

  const [taxDelete, setTaxDelete] = useState(null)
  const [isDelLoading, setIsDelLoading] = useState(false)
  const [refreshToggle, setRefreshToggle] = useState(false)

  const taxTableColumn = [
    {
      name: 'Name',
      minWidth: '180px',
      selector: (row) => <div className="py-2">{row?.name}</div>,
    },
    {
      name: 'Country',
      minWidth: '130px',
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
      name: 'Province / State',
      minWidth: '130px',
      selector: (row) => <div>{row?.provinceDetails?.name ?? '-'}</div>,
    },
    {
      name: 'Value (%)',
      minWidth: '130px',
      selector: (row) => <div className="fw-bold">{row?.percentage.toFixed(2)} %</div>,
    },
    {
      name: 'Action',
      minWidth: '130px',
      right: true,
      selector: (row) => (
        <div>
          <CTooltip content="Edit Tax">
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

          <CTooltip content="Delete Tax">
            <CButton
              size="sm"
              color="danger"
              className="rounded-btn-pill"
              shape="rounded-pill"
              variant="ghost"
              onClick={() => setTaxDelete(row)}
            >
              <CIcon icon={cilTrash} size="lg" />
            </CButton>
          </CTooltip>
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
        delete tobj?.provinceId
      }
      delete tobj[field]
    }
    setQueryFilters(tobj)
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    setFilterObj({
      query: cleanObj(queryFilters),
    })
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

  const handleTaxDelete = () => {
    setIsDelLoading(true)

    Axios({ ...deleteTaxByIDURL(taxDelete?._id) })
      .then((res) => {
        Toast.success(res.data.message)
      })
      .finally(() => {
        setIsDelLoading(false)
        setTaxDelete(null)
        setRefreshToggle((prev) => !prev)
      })
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="bg-white ">
          <h4 className="text-primary mb-0 fw-bold">Tax</h4>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <div className="d-flex flex-column flex-md-row gap-3">
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
              <div className="ms-auto align-self-end">
                <CButton color="primary" onClick={handleSubmit} type="submit">
                  <CIcon icon={cilSearch} /> Search Tax
                </CButton>
              </div>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
      {filterObj?.query?.countryId ? (
        <CCard className="mb-4">
          <CCardHeader className="bg-white d-flex">
            <h5 className="text-primary mb-0">Tax List</h5>
            <div className="ms-auto">
              <CButton size="sm" color="primary" onClick={() => handleAddEditModelOpen(false)}>
                <CIcon icon={cilPlus} size="sm" /> Add Tax
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <Table
              columns={taxTableColumn}
              tableRefresh={true}
              dataURL={taxListURL}
              filter={filterObj}
              checkEqual={refreshToggle}
              populateValue={tablePopulate}
              sorting={{
                created_at: -1,
              }}
            />
          </CCardBody>
        </CCard>
      ) : null}

      <TaxAddEditModel
        isEdit={isEdit}
        isVisible={addEditModel}
        rowValue={rowValue}
        onClose={handleAddEditModelClose}
      />

      <CModal alignment="center" visible={!!taxDelete} onClose={() => setTaxDelete(null)}>
        <CModalHeader>
          <CModalTitle>Delete Tax</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to Delete the Tax?</CModalBody>
        <CModalFooter className="d-flex">
          <CButton color="primary" variant="outline" onClick={() => setTaxDelete(null)}>
            Close
          </CButton>
          <LoadingButton
            className="text-white ms-auto"
            loading={isDelLoading}
            onClick={handleTaxDelete}
            color="danger"
          >
            Okay
          </LoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default TaxList
