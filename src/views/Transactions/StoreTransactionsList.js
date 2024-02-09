import React, { useState } from 'react'
import moment from 'moment'

import { CButton, CCard, CCardBody, CCardHeader, CForm } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

import { CurrencySelect, HFTextField, StoreSelect, Table } from 'components'
import { cleanObj, toAbsoluteUrl } from 'utils/Common'
import { TRANSACTION_TYPE } from 'constants/transaction.constant'
import { transactionListURL } from 'services/api/routes/transaction'
import { Link } from 'react-router-dom'

const StoreTransactionsList = () => {
  const initialQuery = {}
  const initialSearch = {
    keys: ['id'],
    value: '',
  }
  const initialFilterObj = {
    query: initialQuery,
    search: initialSearch,
  }
  const [searchValue, setSearchValue] = useState('')
  const [queryFilters, setQueryFilters] = useState(initialQuery)
  const [filterObj, setFilterObj] = useState(initialFilterObj)

  const selectValues = {}

  const tablePopulate = [
    {
      path: 'currencyDetails',
      select: ['code', 'name'],
    },
    {
      path: 'storeId',
      select: ['name'],
    },
  ]

  const transactionTableColumn = [
    {
      name: 'Invoice No',
      minWidth: '130px',
      selector: (row) => <div>{row?.id}</div>,
    },
    {
      name: 'Currency',
      minWidth: '130px',
      selector: (row) => (
        <div>
          <img
            loading="lazy"
            width="20"
            src={toAbsoluteUrl(`/images/CurrencyFlags/${row?.currencyDetails?.code}.png`)}
            alt={`${row?.currencyDetails?.name} flag`}
          />{' '}
          {row?.currencyDetails?.name} ({row?.currencyDetails?.code})
        </div>
      ),
    },
    {
      name: 'Store Name',
      minWidth: '130px',
      selector: (row) => (
        <div>
          <Link to={`/store/view/${row?.storeId?._id}`}>{row?.storeId?.name}</Link>
        </div>
      ),
    },
    {
      name: 'Created',
      minWidth: '130px',
      selector: (row) => <div>{moment(row?.created_at).format('DD MMM YYYY')}</div>,
    },
    {
      name: 'In',
      right: true,
      minWidth: '90px',
      selector: (row) => (
        <div>
          {row?.type === TRANSACTION_TYPE.STORE_DEPOSIT ? (
            <>
              {row?.amount} {row?.currencyDetails?.code}
            </>
          ) : null}
        </div>
      ),
    },
    {
      name: 'Out',
      right: true,
      minWidth: '90px',
      selector: (row) => (
        <div>
          {row?.type === TRANSACTION_TYPE.STORE_WITHDRAW ? (
            <>
              {row?.amount} {row?.currencyDetails?.code}
            </>
          ) : null}
        </div>
      ),
    },
    {
      name: 'Balance',
      right: true,
      minWidth: '130px',
      selector: (row) => (
        <div>
          {row?.currentAmount} {row?.currencyDetails?.code}
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
        <CCardHeader className="bg-white">
          <h4 className="text-primary mb-0 fw-bold">Store Transactions</h4>
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
                    label="Invoice No"
                    isController={false}
                    value={searchValue}
                    handleOnChange={(val) => {
                      setSearchValue(val)
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <StoreSelect
                    label="Store"
                    defaultValue={queryFilters?.storeId ?? undefined}
                    handleOnChange={(newValue) => handleSelectChange(newValue?._id, 'storeId')}
                  />
                </div>
                <div className="col-md-3">
                  <CurrencySelect
                    label="Currency"
                    defaultValue={queryFilters?.currencyCode ?? undefined}
                    handleOnChange={(newValue) =>
                      handleSelectChange(newValue?.code, 'currencyCode')
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
            columns={transactionTableColumn}
            tableRefresh={true}
            dataURL={transactionListURL}
            populateValue={tablePopulate}
            selectValues={selectValues}
            filter={filterObj}
            sorting={{
              created_at: -1,
            }}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default StoreTransactionsList
