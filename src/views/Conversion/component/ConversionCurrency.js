import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { CButton, CCard, CCardBody, CCardFooter, CForm } from '@coreui/react'

import { CurrencySelect, HFAutoComplete, HFTextField, LoadingButton, Toast } from 'components'
import AmountAlertModel from './AmountAlertModel'

const FIXED_SIDE_OPTIONS = [
  { label: 'Buy', value: 'buy' },
  { label: 'Sell', value: 'sell' },
]

const ConversionCurrency = ({ setStep, setForm, converter }) => {
  const [isLoading, setIsLoading] = useState(false)

  const [sellCurrency, setSellCurrency] = useState(converter?.sellCurrency || null)
  const [buyCurrency, setBuyCurrency] = useState(converter?.buyCurrency || null)
  const [fixedSide, setFixedSide] = useState(converter?.fixedSide || 'buy')
  const [amount, setAmount] = useState(converter?.amount || 0)
  const [showAmountAlert, setShowAmountAlert] = useState(false)

  const nextClickHandler = async (e) => {
    e.preventDefault()
    if (Number(amount) === 0 || Number(amount) < 1) {
      Toast.error('Amount should be greater than or equal to 1.')
      return
    }
    if (isNaN(amount)) {
      Toast.error('Amount should be a number.')
      return
    }

    if (!!buyCurrency && !!sellCurrency && buyCurrency === sellCurrency) {
      Toast.error('Source and Destination Currency should be different.')
      return
    }

    if (Number(amount) > 3000 && Number(amount) < 9999.99) {
      setShowAmountAlert(true)
    } else {
      setShowAmountAlert(false)
      formDataHandler()
    }
  }

  const formDataHandler = async () => {
    setIsLoading(true)

    try {
      await setForm({
        buyCurrency,
        sellCurrency,
        fixedSide,
        amount,
      }).then(() => setStep((prev) => prev + 1))
    } catch (err) {
      Toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleModelClose = () => {
    setShowAmountAlert(false)
  }

  return (
    <>
      <CCard>
        <CForm>
          <CCardBody>
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="mb-3">
                  <CurrencySelect
                    label="Sell"
                    defaultValue={sellCurrency ?? undefined}
                    handleOnChange={(newValue) => setSellCurrency(newValue?.code)}
                  />
                </div>
                <div className="mb-3">
                  <CurrencySelect
                    label="Buy"
                    defaultValue={buyCurrency ?? undefined}
                    handleOnChange={(newValue) => setBuyCurrency(newValue?.code)}
                  />
                </div>
                <div className="mb-3 d-flex">
                  <div style={{ width: '40%' }} className="me-2">
                    <HFAutoComplete
                      id="fixedSide"
                      name="fixedSide"
                      label="Amount to"
                      isController={false}
                      isClearable={false}
                      isSearchable={false}
                      options={FIXED_SIDE_OPTIONS}
                      defaultValue={fixedSide ?? undefined}
                      handleOnChange={(newValue) => setFixedSide(newValue?.value)}
                    />
                  </div>
                  <div style={{ width: '60%' }}>
                    <HFTextField
                      id="amount"
                      name="amount"
                      label="Value"
                      isController={false}
                      type="number"
                      value={amount}
                      handleOnChange={(val) => {
                        setAmount(val)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CCardBody>
          <CCardFooter className="bg-white d-flex">
            <CButton className="px-4 me-3" variant="outline" color="primary" onClick={handleBack}>
              Back
            </CButton>

            <LoadingButton
              loading={isLoading}
              disabled={!buyCurrency || !sellCurrency || !amount}
              color="primary"
              type="submit"
              className="px-4 ms-auto"
              onClick={nextClickHandler}
            >
              Get a Quote
            </LoadingButton>
          </CCardFooter>
        </CForm>
      </CCard>
      {showAmountAlert && (
        <AmountAlertModel
          amount={amount}
          onClose={handleModelClose}
          showAmountAlert={showAmountAlert}
          onConfirm={formDataHandler}
        />
      )}
    </>
  )
}

ConversionCurrency.propTypes = {
  converter: PropTypes.any,
  setForm: PropTypes.func,
  setStep: PropTypes.func,
  step: PropTypes.any,
}

export default ConversionCurrency
