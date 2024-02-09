import React, { useCallback, useEffect, useState } from 'react'

import { CButton, CCard, CCardBody, CCardHeader, CForm } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

import { CurrencySelect, Spinner } from 'components'
import { cleanObj } from 'utils/Common'
import Axios from 'services/api/Config'
import { currencyChargesListURL } from 'services/api/routes/conversion-rate'
import RateCard from './components/RateCard'

const ConversionRates = () => {
  const initialQuery = {}
  const initialFilterObj = {
    options: {
      pagination: false,
      populate: [
        {
          path: 'baseCurrencyDetails',
          select: ['code', 'name'],
        },
        {
          path: 'destinationCurrencyDetails',
          select: ['code', 'name'],
        },
      ],
    },
    query: initialQuery,
  }
  const [queryFilters, setQueryFilters] = useState(initialQuery)
  const [filterObj, setFilterObj] = useState(initialFilterObj)
  // const [showRates, setShowRates] = useState(false)
  const [rateList, setRateList] = useState([])
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectChange = (value, field) => {
    let tobj = { ...queryFilters }
    // setShowRates(false)
    if (value) {
      tobj[field] = value
    } else {
      delete tobj[field]
    }
    setQueryFilters(tobj)
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    setFilterObj((prev) => ({
      ...prev,
      query: cleanObj(queryFilters),
    }))
    // if (queryFilters?.storeId) {
    // setShowRates(true)
    // }
  }

  const fetchData = useCallback(() => {
    setIsLoading(true)
    delete filterObj.query?.storeId
    Axios({ ...currencyChargesListURL, data: filterObj })
      .then((res) => {
        setRateList(res?.data?.data?.list)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [filterObj])

  useEffect(() => {
    fetchData()
  }, [fetchData, refreshToggle])

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="bg-white">
          <h4 className="text-primary mb-0 fw-bold">Conversion Rates</h4>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <div className="d-flex flex-column flex-md-row gap-3">
              <div className="col-md-11 row">
                {/* <div className="col-md-3">
                  <StoreSelect
                    label="Store"
                    defaultValue={queryFilters?.storeId ?? undefined}
                    handleOnChange={(newValue) => handleSelectChange(newValue?._id, 'storeId')}
                  />
                </div> */}
                <div className="col-md-3">
                  <CurrencySelect
                    label="Base Currency"
                    defaultValue={queryFilters?.baseCurrency ?? undefined}
                    handleOnChange={(newValue) =>
                      handleSelectChange(newValue?.code, 'baseCurrency')
                    }
                  />
                </div>
                <div className="col-md-3">
                  <CurrencySelect
                    label="Destination Currency"
                    defaultValue={queryFilters?.destinationCurrency ?? undefined}
                    handleOnChange={(newValue) =>
                      handleSelectChange(newValue?.code, 'destinationCurrency')
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
        </CCardBody>
      </CCard>

      {/* {showRates && (
        <> */}
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {rateList.length > 0 ? (
            <CCard>
              <CCardBody>
                <div className="row g-3">
                  {rateList.map((rateDetails) => (
                    <div className="col-12 col-md-6 col-xl-3" key={rateDetails?._id}>
                      <RateCard rateDetails={rateDetails} setRefreshToggle={setRefreshToggle} />
                    </div>
                  ))}
                </div>
              </CCardBody>
            </CCard>
          ) : (
            <h5 className="mt-3 text-center">No rates found!</h5>
          )}
        </>
      )}
      {/* </> 
       )} */}
    </>
  )
}

export default ConversionRates
