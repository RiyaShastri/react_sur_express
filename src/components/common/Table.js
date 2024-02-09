import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component'

import { CTooltip } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilReload } from '@coreui/icons'

import Axios from 'services/api/Config'
import Spinner from './Spinner'

import { copyObj } from 'utils/Common'
import { isEqual } from 'utils/LodashImports'

const Table = ({
  columns,
  tableDATA,
  dataURL,
  query,
  search,
  filter,
  showPagination: paginationSetting = true,
  populateValue,
  sorting,
  selectValues,
  customStyles = {},
  expandableRows = false,
  tableRefresh = false,
  checkEqual = true,
  expandedComponent,
  conditionalRowStyles = [],
}) => {
  const showPagination = paginationSetting ? true : paginationSetting
  const [tableData, setTableData] = useState(tableDATA)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [resPaginator, setResPaginator] = useState({})
  const defaultSort = sorting ? Object.keys(sorting)[0] : null

  const [obj, setObj] = useState({
    query: filter ? filter.query : query ? query : undefined,
    options: {
      select: selectValues ? selectValues : {},
      limit: pageSize,
      page: currentPage,
      sort: sorting,
      pagination: true,
      populate: populateValue === undefined ? [] : [...populateValue],
    },
    search: filter ? filter.search : search ? search : undefined,
  })

  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)

  useMemo(() => {
    if (query !== null && query !== undefined) {
      let options = copyObj(obj)
      options = {
        ...options,
        query: query,
      }
      if (isEqual({}, query)) {
        delete options.query
      }
      setObj(options)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useMemo(() => {
    if (search) {
      let options = { ...obj }
      if (search?.value === '') {
        options['search'] = undefined
      } else {
        options['search'] = search
      }

      setObj(options)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useMemo(() => {
    if (filter) {
      let options = copyObj(obj)

      if (filter?.search?.value === '') {
        options['search'] = undefined
      } else {
        options['search'] = filter.search
      }

      if (
        filter.query !== undefined &&
        filter.query !== null &&
        !isEqual(obj.query, filter.query)
      ) {
        options['query'] = filter.query
      }

      if (isEqual({}, options.query)) {
        options['query'] = undefined
      }

      if (!isEqual(options, obj)) {
        setObj(options)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  useEffect(() => {
    if (obj && dataURL) {
      setLoading(true)

      Axios({ ...dataURL, data: obj })
        .then((res) => {
          setTableData(res.data.data === null ? [] : res.data.data.list)
          setResPaginator(res.data.data === null ? [] : res.data.data.pagination)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [dataURL, obj, checkEqual])

  const handlePerRowsChange = (pgSize) => {
    let options = {
      ...obj,
      options: {
        ...obj.options,
        limit: pgSize,
        page: 1,
      },
    }
    setCurrentPage(1)
    setObj(options)
    setPageSize(pgSize)

    setResetPaginationToggle(!resetPaginationToggle)
  }

  const handlePageChange = (pgNo) => {
    let options = {
      ...obj,
      options: {
        ...obj.options,
        page: pgNo,
      },
    }
    setObj(options)
    setCurrentPage(pgNo)
  }

  const handleSort = (column, sortDirection) => {
    let direction
    if (sortDirection === 'desc') {
      direction = -1
    } else if (sortDirection === 'asc') {
      direction = 1
    }

    let tFilter = {}
    tFilter[column.id] = direction

    let options = {
      ...obj,
      options: {
        ...obj.options,
        sort: {
          ...tFilter,
        },
      },
    }
    setObj(options)
  }

  const handleRefresh = () => {
    setObj((prev) => ({ ...prev }))
  }

  const subHeaderComponent = (
    <CTooltip content="Refresh Table" placement="left">
      <CIcon icon={cilReload} onClick={handleRefresh} />
    </CTooltip>
  )

  return (
    <div className="react-dataTable position-relative">
      <DataTable
        noHeader={!tableRefresh}
        actions={subHeaderComponent}
        persistTableHead={true}
        className="react-dataTable"
        customStyles={customStyles}
        progressPending={loading}
        progressComponent={
          <div className="d-flex justify-content-center my-4 gap-1">
            <Spinner />
          </div>
        }
        columns={columns}
        data={tableData}
        expandableRows={expandableRows}
        expandableRowsComponent={expandedComponent}
        expandableRowExpanded={(row) => (row.id ? true : false)}
        paginationServer
        pagination={showPagination}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        paginationPerPage={pageSize}
        paginationTotalRows={resPaginator ? resPaginator?.total_entries : 0}
        sortServer
        defaultSortFieldId={defaultSort}
        defaultSortAsc={true}
        onSort={(column, sortDirection) => {
          handleSort(column, sortDirection)
        }}
        conditionalRowStyles={conditionalRowStyles}
        paginationResetDefaultPage={resetPaginationToggle}
      />
    </div>
  )
}

Table.propTypes = {
  checkEqual: PropTypes.bool,
  columns: PropTypes.any,
  conditionalRowStyles: PropTypes.array,
  customStyles: PropTypes.object,
  dataURL: PropTypes.any,
  expandableRows: PropTypes.bool,
  expandedComponent: PropTypes.any,
  filter: PropTypes.shape({
    query: PropTypes.any,
    search: PropTypes.shape({
      value: PropTypes.string,
    }),
  }),
  populateValue: PropTypes.any,
  query: PropTypes.any,
  search: PropTypes.shape({
    value: PropTypes.string,
  }),
  selectValues: PropTypes.any,
  showPagination: PropTypes.bool,
  sorting: PropTypes.any,
  tableDATA: PropTypes.any,
  tableRefresh: PropTypes.bool,
}

export default Table
