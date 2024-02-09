import React, { useCallback, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import DataTable from 'react-data-table-component'
import { useSelector } from 'react-redux'
import { getLiveAmountURL } from 'services/api/routes/conversion'
import Axios from 'services/api/Config'

const customStyles = {
  headCells: {
    style: {
      fontSize: '16px',
      fontWeight: '600',
    },
  },
}

const liveRateArr = [
  { baseCurrencyCode: 'XOF', destinationCurrencyCode: 'CAD', conversionRate: 0.002195 },
  { baseCurrencyCode: 'XOF', destinationCurrencyCode: 'USD', conversionRate: 0.001649 },
  { baseCurrencyCode: 'XOF', destinationCurrencyCode: 'EUR', conversionRate: 0.001528 },
  { baseCurrencyCode: 'XOF', destinationCurrencyCode: 'GBP', conversionRate: 0.001308 },
  { baseCurrencyCode: 'XOF', destinationCurrencyCode: 'XAF', conversionRate: 1.002038 },
  { baseCurrencyCode: 'CAD', destinationCurrencyCode: 'XOF', conversionRate: 455.489348 },
  { baseCurrencyCode: 'CAD', destinationCurrencyCode: 'USD', conversionRate: 0.751012 },
  { baseCurrencyCode: 'CAD', destinationCurrencyCode: 'EUR', conversionRate: 0.696091 },
  { baseCurrencyCode: 'CAD', destinationCurrencyCode: 'GBP', conversionRate: 0.595741 },
  { baseCurrencyCode: 'CAD', destinationCurrencyCode: 'XAF', conversionRate: 456.417714 },
  { baseCurrencyCode: 'USD', destinationCurrencyCode: 'XOF', conversionRate: 606.501134 },
  { baseCurrencyCode: 'USD', destinationCurrencyCode: 'CAD', conversionRate: 1.331537 },
  { baseCurrencyCode: 'USD', destinationCurrencyCode: 'EUR', conversionRate: 0.926871 },
  { baseCurrencyCode: 'USD', destinationCurrencyCode: 'GBP', conversionRate: 0.793251 },
  { baseCurrencyCode: 'USD', destinationCurrencyCode: 'XAF', conversionRate: 607.737289 },
  { baseCurrencyCode: 'EUR', destinationCurrencyCode: 'XOF', conversionRate: 654.353188 },
  { baseCurrencyCode: 'EUR', destinationCurrencyCode: 'CAD', conversionRate: 1.436594 },
  { baseCurrencyCode: 'EUR', destinationCurrencyCode: 'USD', conversionRate: 1.078899 },
  { baseCurrencyCode: 'EUR', destinationCurrencyCode: 'GBP', conversionRate: 0.855838 },
  { baseCurrencyCode: 'EUR', destinationCurrencyCode: 'XAF', conversionRate: 655.686874 },
  { baseCurrencyCode: 'GBP', destinationCurrencyCode: 'XOF', conversionRate: 764.576293 },
  { baseCurrencyCode: 'GBP', destinationCurrencyCode: 'CAD', conversionRate: 1.678582 },
  { baseCurrencyCode: 'GBP', destinationCurrencyCode: 'USD', conversionRate: 1.260635 },
  { baseCurrencyCode: 'GBP', destinationCurrencyCode: 'EUR', conversionRate: 1.168446 },
  { baseCurrencyCode: 'GBP', destinationCurrencyCode: 'XAF', conversionRate: 766.134633 },
  { baseCurrencyCode: 'XAF', destinationCurrencyCode: 'XOF', conversionRate: 0.997966 },
  { baseCurrencyCode: 'XAF', destinationCurrencyCode: 'CAD', conversionRate: 0.002191 },
  { baseCurrencyCode: 'XAF', destinationCurrencyCode: 'USD', conversionRate: 0.001645 },
  { baseCurrencyCode: 'XAF', destinationCurrencyCode: 'EUR', conversionRate: 0.001525 },
  { baseCurrencyCode: 'XAF', destinationCurrencyCode: 'GBP', conversionRate: 0.001305 },
]

const columns = [
  {
    name: 'Currency Code',
    selector: (row) => `${row.base_currency} / ${row.destination_currency}`,
  },
  {
    name: 'Conversion Rate',
    selector: (row) => Number(row.fxRate).toFixed(3),
  },
]

const HeroSection = () => {
  const [liveRate, setLiveRate] = useState(liveRateArr)
  const [filteredCurrObj, setFilteredCurrObj] = useState({})
  const { currency } = useSelector((state) => state.general)

  const liveRateAPICall = () => {
    const livePayload = {
      fromCurrency: '63109ed4309f0cc86d0cd673',
      toCurrency: '63109ed4309f0cc86d0cd6d3',
      amount: 100,
      fixed_side: 'buy',
      customerId: '6476ef0651b5f7456559b3c5',
    }
    Axios({ ...getLiveAmountURL, data: livePayload }).then((res) => {
      setLiveRate(res.data.data)
    })
  }

  const filterLiveRate = useCallback(() => {
    let newCurrObj = {}
    currency.forEach((x) => {
      newCurrObj[x.code] = liveRate?.filter((ele) => ele.base_currency === x.code)
    })
    setFilteredCurrObj(newCurrObj)
  }, [currency, liveRate])

  useEffect(() => {
    const socket = io.connect(process.env.REACT_APP_SOCKET_URL)
    // console.log('socket....', socket)

    socket.on('connection', () => {})

    socket.on('currency-pairs', () => {
      // console.log('........Get Socket Response........')
      liveRateAPICall()
    })

    return () => {
      socket.off('disconnect')
    }
  }, [])

  useEffect(() => {
    filterLiveRate()
  }, [filterLiveRate])

  return (
    <>
      <div className="hero-container">
        <div>
          <img className="landing-hero-image" src="/images/logo-banner.jpg" alt="SurExpress Hero" />
        </div>

        {currency && currency.length > 0 && (
          <div className="my-5 container ">
            <h2 className="fw-bold"> Live Exchange Rates </h2>

            <CRow
              xs={{ cols: 1, gutter: 3 }}
              md={{ cols: 2 }}
              lg={{ cols: 3 }}
              className="px-0 mt-2"
            >
              {currency.map((curr) => {
                return (
                  <CCol xs key={curr.name} className="py-3 live-rate ">
                    <CCard className="h-100">
                      <CCardHeader className="bg-white">
                        <div className="title d-flex align-item-center">
                          <img
                            src={curr.flag}
                            alt="flag"
                            className="flag-img mr-4 rounded-circle"
                            style={{}}
                          />
                          <p className="text-primary fw-bold">
                            {`${curr.name} `} {`(${curr.code})`}
                          </p>
                        </div>
                      </CCardHeader>
                      <CCardBody className="table-container">
                        <DataTable
                          columns={columns}
                          data={filteredCurrObj[curr.code]}
                          fixedHeader={true}
                          responsive={true}
                          striped={true}
                          highlightOnHover={true}
                          customStyles={customStyles}
                        />
                      </CCardBody>
                    </CCard>
                  </CCol>
                )
              })}
            </CRow>
          </div>
        )}
      </div>
    </>
  )
}

export default HeroSection
