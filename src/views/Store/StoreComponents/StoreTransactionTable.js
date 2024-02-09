import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'

import { CurrencySelect, HFTextField, Table } from 'components'
import { cleanObj, toAbsoluteUrl } from 'utils/Common'
import { TRANSACTION_TYPE } from 'constants/transaction.constant'
import { transactionListURL } from 'services/api/routes/transaction'
import useModulePermissions from 'utils/hooks/useModulePermissions'

import TransactionAddModel from './TransactionAddModel'
import { ROLE_PERMISSIONS } from 'constants/permissions.constants'

const StoreTransactionTable = () => {
  let { storeId } = useParams()
  const { permissionCheck } = useModulePermissions()

  const initialQuery = { storeId: storeId }
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

  const [addModel, setAddModel] = useState(false)
  const [refreshToggle, setRefreshToggle] = useState(false)

  const selectValues = {}

  const tablePopulate = [
    {
      path: 'currencyDetails',
      select: ['code', 'name'],
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
          {row?.currentAmount.toFixed(2)} {row?.currencyDetails?.code}
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
    setFilterObj({
      query: cleanObj(tobj),
      search: {
        ...initialSearch,
        value: searchValue,
      },
    })
  }

  const handleChange = (val) => {
    setSearchValue(val)
    setFilterObj({
      query: cleanObj(queryFilters),
      search: {
        ...initialSearch,
        value: val,
      },
    })
  }

  // const handleSubmit = (e) => {
  //   e?.preventDefault()
  //   setFilterObj({
  //     query: cleanObj(queryFilters),
  //     search: {
  //       ...initialSearch,
  //       value: searchValue,
  //     },
  //   })
  // }

  const handleAddModelOpen = () => {
    setAddModel(true)
  }

  const handleAddModelClose = () => {
    setAddModel(null)
    setRefreshToggle((prev) => !prev)
  }

  return (
    <div className="mt-3">
      <div className="d-flex gap-3">
        <div className="col-md-3">
          <HFTextField
            id="name"
            name="name"
            placeholder="Search..."
            label="Invoice No"
            isController={false}
            value={searchValue}
            handleOnChange={(val) => {
              handleChange(val)
            }}
          />
        </div>
        <div className="col-md-3">
          <CurrencySelect
            label="Currency"
            defaultValue={queryFilters?.currencyCode ?? undefined}
            handleOnChange={(newValue) => handleSelectChange(newValue?.code, 'currencyCode')}
          />
        </div>
        {permissionCheck(ROLE_PERMISSIONS.STORE_TRANSACTION.CREATE) ? (
          <div className="align-self-end ms-auto mb-3">
            <CButton size="sm" color="primary" onClick={() => handleAddModelOpen(false)}>
              <CIcon icon={cilPlus} /> Add Transaction
            </CButton>
          </div>
        ) : null}
      </div>

      <Table
        columns={transactionTableColumn}
        tableRefresh={true}
        dataURL={transactionListURL}
        populateValue={tablePopulate}
        selectValues={selectValues}
        checkEqual={refreshToggle}
        filter={filterObj}
        sorting={{
          created_at: -1,
        }}
      />

      <TransactionAddModel isVisible={addModel} onClose={handleAddModelClose} />
    </div>
  )
}

export default StoreTransactionTable
