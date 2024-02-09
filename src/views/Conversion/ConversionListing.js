import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCardHeader, CForm } from '@coreui/react'
import { CurrencySelect, CustomerSelect, HFTextField, Table } from 'components'
import { CONVERSION_STATUS } from 'constants/conversion.constant'
import moment from 'moment'
import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cleanObj } from 'utils/Common'

const ConversionListing = () => {
  const tablePopulate = []
  const initialQuery = {}
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

  // const [refreshToggle, setRefreshToggle] = useState(false)
  // const [modelVisible, setModelVisible] = useState(null)
  // const [isLoading, setIsLoading] = useState(false)

  const conversionTableColumn = [
    {
      name: 'Reference',
      minWidth: '180px',
      selector: (row) => (
        <div className="py-2">
          <Link to={`/store/view/${row?._id}`}>{row?.name}</Link>
        </div>
      ),
    },
    {
      name: 'Customer',
      minWidth: '130px',
      selector: (row) => <div>{row?.cityDetails?.name}</div>,
    },
    {
      name: 'Created Date',
      minWidth: '130px',
      selector: (row) => (
        <div>{row?.created_at ? moment(row?.created_at).format('DD MMM YYYY') : '-'}</div>
      ),
    },
    {
      name: 'Settlement Date',
      minWidth: '130px',
      selector: (row) => (
        <div>{row?.settlement_date ? moment(row?.settlement_date).format('DD MMM YYYY') : '-'}</div>
      ),
    },
    {
      name: 'Status',
      minWidth: '130px',
      selector: (row) => <div>{CONVERSION_STATUS[row?.status]}</div>,
    },
    {
      name: 'Rate',
      width: '90px',
      right: true,
      selector: (row) => <div>{(+row?.labels?.netExchangeRate)?.toFixed(4)}</div>,
    },
    {
      name: 'Sold',
      right: true,
      minWidth: '150px',
      selector: (row) => (
        <div>
          <b>
            {row?.client_sell_amount} {row?.sell_currency}
          </b>
        </div>
      ),
    },
    {
      name: 'Bought',
      right: true,
      minWidth: '150px',
      selector: (row) => (
        <div>
          <b>
            {row?.client_buy_amount} {row?.buy_currency}
          </b>
        </div>
      ),
    },
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
        value: searchValue,
      },
    })
  }
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="bg-white d-flex">
          <h4 className="text-primary fw-bold mb-0">Conversions</h4>
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
                  <CustomerSelect
                    label="Customer"
                    defaultCode="_id"
                    defaultValue={queryFilters?.customerId ?? undefined}
                    handleOnChange={(newValue) => handleSelectChange(newValue?._id, 'customerId')}
                  />
                </div>
                <div className="col-md-3">
                  <CurrencySelect
                    label="Sold"
                    defaultCode="_id"
                    defaultValue={queryFilters?.sell_currency ?? undefined}
                    handleOnChange={(newValue) =>
                      handleSelectChange(newValue?._id, 'sell_currency')
                    }
                  />
                </div>
                <div className="col-md-3">
                  <CurrencySelect
                    label="Bought"
                    defaultCode="_id"
                    defaultValue={queryFilters?.buy_currency ?? undefined}
                    handleOnChange={(newValue) => handleSelectChange(newValue?._id, 'buy_currency')}
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
            columns={conversionTableColumn}
            tableRefresh={true}
            // dataURL={storeListURL}
            // checkEqual={refreshToggle}
            populateValue={tablePopulate}
            filter={filterObj}
            sorting={{
              name: 1,
            }}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default ConversionListing
