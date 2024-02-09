import React, { useState } from 'react'

import { CButton, CCard, CCardBody, CCardHeader, CForm } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { HFDatePicker, Table } from 'components'
import { cleanObj } from 'utils/Common'
import CreateStatementModel from './components/CreateStatementModel'
import ViewStatementModel from './components/ViewStatementModel'

const MonthlyStatements = () => {
  // const { authUser, authType } = useAuthUser()
  // const initialQuery = { storeId: authUser?.storeId }
  const initialQuery = {}
  const [queryFilters, setQueryFilters] = useState(initialQuery)
  const [filterObj, setFilterObj] = useState({
    query: initialQuery,
    // search: initialSearch,
  })

  const statementTableColumn = [
    {
      name: 'Month',
      minWidth: '130px',
      selector: (row) => <div>{row?.id}</div>,
    },
    {
      name: 'Duration',
      minWidth: '130px',
      selector: (row) => (
        <div>
          {row?.currencyId?.from} ({row?.currencyId?.to})
        </div>
      ),
    },
    {
      name: 'Action',
      minWidth: '130px',
      right: true,
      selector: (row) => <ViewStatementModel />,
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
      // search: {
      //   ...initialSearch,
      //   value: searchValue,
      // },
    })
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="bg-white d-flex">
          <h4 className="text-primary mb-0 fw-bold">Monthly Statements</h4>
          <div className="ms-auto">
            <CreateStatementModel />
          </div>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <div className="d-flex flex-column flex-md-row gap-3">
              <div className="col-md-11 row">
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
              </div>
              <div className="align-self-end mb-3 w-100">
                <CButton color="primary" type="submit" className="w-100" onClick={handleSubmit}>
                  <CIcon icon={cilSearch} /> Search
                </CButton>
              </div>
            </div>
          </CForm>

          <Table
            columns={statementTableColumn}
            tableRefresh={true}
            // dataURL={transactionListURL}
            // populateValue={tablePopulate}
            // selectValues={selectValues}
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

export default MonthlyStatements
