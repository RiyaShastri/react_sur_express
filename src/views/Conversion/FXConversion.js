import React, { useState } from 'react'

import { CCard, CCardBody, CCardHeader } from '@coreui/react'

import { StepperBar, Toast } from 'components'

import ConversionCurrency from './component/ConversionCurrency'
import ConversionQuote from './component/ConversionQuote'
import ConversionComplete from './component/ConversionComplete'
import CustomerReview from './component/CustomerReview'
import { createConversionURL, getConversionQuoteURL } from 'services/api/routes/conversion'
import Axios from 'services/api/Config'

const FXConversion = () => {
  const initialState = {
    buyCurrency: null,
    sellCurrency: null,
    fixedSide: 'buy',
    amount: 0,
    customerId: null,
    conversionId: null,
    quote: {},
    conversion: {},
  }

  const [step, setStep] = useState(1)
  const [converter, setConverter] = useState(initialState)

  const handleForm1 = (id) => {
    setConverter((prev) => ({
      ...prev,
      customerId: id,
    }))
  }

  const handleForm2 = async ({ buyCurrency, sellCurrency, fixedSide, amount }) => {
    try {
      setConverter((prev) => ({
        ...prev,
        buyCurrency,
        sellCurrency,
        fixedSide,
        amount,
      }))
      await getQuote({ sellCurrency, buyCurrency, fixedSide, amount }).then(() => {
        return true
      })
    } catch (err) {
      throw new Error(err.response.data.message)
    }
  }

  const getQuote = async ({ sellCurrency, buyCurrency, fixedSide, amount }) => {
    const requestPayload = {
      fixed_side: fixedSide,
      amount: amount,
      fromCurrency: sellCurrency,
      toCurrency: buyCurrency,
      customerId: converter.customerId,
    }
    try {
      const res = await Axios({ ...getConversionQuoteURL, data: requestPayload })
      setConverter((prev) => ({
        ...prev,
        quote: res.data.data,
        conversionId: res.data.data.conversionId,
      }))
    } catch (err) {
      Toast.error(err.response.data.message)
      throw new Error(err.response.data.message)
    }
  }

  const createConversion = async () => {
    try {
      const requestPayload = { conversionId: converter?.conversionId }
      const res = await Axios({ ...createConversionURL, data: requestPayload })
      setConverter((prev) => ({ ...prev, conversion: res.data.data }))
      return true
    } catch (err) {
      const finalErrors =
        err.response?.data?.data?.error_messages &&
        Object.keys(err.response.data.data.error_messages).map(
          (type) => err.response.data.data.error_messages[type][0]?.message,
        )
      // Todo: Error handling on page 1
      // setCreationError(finalErrors || ['Something went wrong'])
      Toast.error(finalErrors || 'Something went wrong')
      setStep(1)
      throw new Error(err.response?.data.message)
    }
  }
  const clearForm = () => {
    setConverter(initialState)
  }

  const components = [
    <CustomerReview
      key={1}
      step={step}
      setStep={setStep}
      setForm={handleForm1}
      selectedVal={converter?.customerId}
    />,
    <ConversionCurrency
      key={2}
      step={step}
      setStep={setStep}
      setForm={handleForm2}
      converter={converter}
    />,
    <ConversionQuote
      key={3}
      step={step}
      setStep={setStep}
      quote={converter.quote}
      getQuote={getQuote}
      converter={converter}
      createConversion={createConversion}
    />,
    <ConversionComplete
      key={4}
      step={step}
      setStep={setStep}
      conversion={converter.conversion}
      clearForm={clearForm}
    />,
  ]

  return (
    <CCard className="mb-4">
      <CCardHeader className="bg-white d-flex">
        <h4 className="text-primary fw-bold mb-0">FX Conversion</h4>
      </CCardHeader>
      <CCardBody>
        <StepperBar
          label={['Customer Details', 'Currencies', 'Quote', 'Complete']}
          currentStep={step - 1}
        />
        <div className="row justify-content-center">
          <div className="col-md-8">{components[step - 1]}</div>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default FXConversion
