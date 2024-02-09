import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { CButton, CCard, CCardBody, CCardFooter, CFormCheck } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilClock, cilDoubleQuoteSansLeft } from '@coreui/icons'

import { LoadingButton } from 'components'

const ConversionQuote = ({ setStep, quote, getQuote, converter, createConversion }) => {
  const [counter, setCounter] = useState(20)
  const [quoteCheck, setQuoteCheck] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const timer = counter > 0 && !isLoading && setInterval(() => setCounter(counter - 1), 1000)
    return () => clearInterval(timer)
  }, [counter, isLoading])

  const reQuoteHandler = () => {
    setIsLoading(true)
    const { sellCurrency, buyCurrency, fixedSide, amount } = converter

    getQuote({ sellCurrency, buyCurrency, fixedSide, amount })
      .then(() => setCounter(20))
      .finally(() => setIsLoading(false))
  }

  const createConversionHandler = () => {
    setIsLoading(true)
    createConversion()
      .then(() => setStep(4))
      .catch(() => setStep(1))
      .finally(() => setIsLoading(false))
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  return (
    <CCard>
      <CCardBody>
        <div className="row">
          <div className="col-md-6">
            <h5 className="fw-bold text-primary">
              <CIcon icon={cilDoubleQuoteSansLeft} size="lg" /> Quote
            </h5>
            <div className="ms-4">
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Selling:</span>
                <span>
                  {Number(quote.sourceAmount).toFixed(2)} {quote.baseCurrencyCode}
                </span>
              </div>
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Buying:</span>
                <span>
                  {Number(quote.destinationAmount).toFixed(2)} {quote.destinationCurrencyCode}
                </span>
              </div>
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Your Exchange Rate:</span>
                <span>
                  {Number(quote.exchangeRate).toFixed(3)} (inverse:{' '}
                  <b>{(1 / Number(quote.exchangeRate)).toFixed(3)}</b>){' '}
                </span>
              </div>
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Settlement Date:</span>
                <span>
                  {moment(quote.settlement_cut_off_time).utc().format('DD MMM YYYY @ HH:mm')} GMT
                </span>
              </div>
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Conversion Date:</span>
                <span>{moment(converter.conversionDate).format('DD MMM YYYY')}</span>
              </div>
              <div className="mb-2 fw-5">
                <span>Funds will be available the same day</span>
              </div>
            </div>
          </div>
          <div>
            {counter > 0 ? (
              <div className="result-box">
                <CIcon icon={cilClock} size="lg" /> Quote Expires in{' '}
                <span className="text-danger">{counter}</span> seconds
              </div>
            ) : (
              <div className="result-box">
                <CIcon icon={cilClock} size="lg" /> Quote Expired, Get Another Quote
              </div>
            )}
            {counter > 0 ? (
              <div className="ms-3 mt-3">
                <CFormCheck
                  label="I am happy with this quote"
                  id="flexCheckDefault"
                  defaultChecked={quoteCheck}
                  onClick={(e) => setQuoteCheck(e.target.checked)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </CCardBody>
      <CCardFooter className="bg-white d-flex">
        <CButton className="px-4 me-3" variant="outline" color="primary" onClick={handleBack}>
          Back
        </CButton>
        {counter > 0 && (
          <LoadingButton
            color="primary"
            className="px-4 ms-auto"
            loading={isLoading}
            disabled={!quoteCheck}
            onClick={createConversionHandler}
          >
            Convert
          </LoadingButton>
        )}
        {counter === 0 && (
          <LoadingButton
            color="primary"
            className="px-4 ms-auto"
            loading={isLoading}
            onClick={reQuoteHandler}
          >
            Re-Quote
          </LoadingButton>
        )}
      </CCardFooter>
    </CCard>
  )
}

ConversionQuote.propTypes = {
  converter: PropTypes.shape({
    amount: PropTypes.any,
    buyCurrency: PropTypes.any,
    fixedSide: PropTypes.any,
    sellCurrency: PropTypes.any,
    conversionDate: PropTypes.any,
  }),
  createConversion: PropTypes.func,
  getQuote: PropTypes.func,
  quote: PropTypes.any,
  setForm: PropTypes.any,
  setStep: PropTypes.func,
}

export default ConversionQuote
