import React, { useState } from 'react'
import { CurrencySelect, HFTextField } from 'components'
import { CCard, CCardBody, CForm, CSpinner } from '@coreui/react'
import { Controller, useForm } from 'react-hook-form'
import { getExchangeAmountURL } from 'services/api/routes/conversion'
import Axios from 'services/api/Config'
import { debounce } from 'lodash'

const initialValues = {
  base_currency: '',
  destination_currency: '',
  sellAmount: '',
  buyAmount: '',
}

const ConversionSection = () => {
  // const [isDisabled, setIsDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const {
    setValue,
    getValues,
    watch,
    control: conversionControl,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    defaultValues: initialValues,
  })

  const setControlsValue = (isSwipe, newValue) => {
    if (isSwipe) {
      setValue('base_currency', newValue.destination_currency ? newValue.destination_currency : '')
      setValue('destination_currency', newValue.base_currency ? newValue.base_currency : '')

      if (
        newValue.buyAmount !== null &&
        newValue.buyAmount !== '' &&
        newValue.buyAmount !== 0 &&
        newValue.sellAmount !== null &&
        newValue.sellAmount !== '' &&
        newValue.sellAmount !== 0
      ) {
        setValue('sellAmount', newValue.buyAmount ? newValue.buyAmount : '')
        setValue('buyAmount', '')
      } else if (
        (newValue.buyAmount === null || newValue.buyAmount === '' || newValue.buyAmount === 0) &&
        newValue?.sellAmount !== null &&
        newValue.sellAmount !== '' &&
        newValue.sellAmount !== 0
      ) {
        setValue('sellAmount', '')
        setValue('buyAmount', newValue.sellAmount ? newValue.sellAmount : '')
      } else if (
        (newValue.sellAmount === null || newValue.sellAmount === '' || newValue.sellAmount === 0) &&
        newValue?.buyAmount !== null &&
        newValue.buyAmount !== '' &&
        newValue.buyAmount !== 0
      ) {
        setValue('buyAmount', '')
        setValue('sellAmount', newValue.buyAmount ? newValue.buyAmount : '')
      }
    } else {
      setValue('base_currency', newValue?.baseCurrency ? newValue?.baseCurrency : '')
      setValue(
        'destination_currency',
        newValue?.destinationCurrency ? newValue?.destinationCurrency : '',
      )
      setValue('sellAmount', newValue?.sellAmount ? Number(newValue?.sellAmount).toFixed(2) : '')
      setValue('buyAmount', newValue?.buyAmount ? Number(newValue?.buyAmount).toFixed(2) : '')
    }
  }

  const swipeBtnClick = (e) => {
    e.preventDefault()
    const currentFormValue = { ...getValues() }
    setControlsValue(true, currentFormValue)
    conversionApiCall()
  }

  const conversionApiCall = () => {
    if (isValid) {
      setIsLoading(true)
      const finalResponse = { ...getValues() }
      if (
        finalResponse['base_currency'] &&
        finalResponse['destination_currency'] &&
        (finalResponse['sellAmount'] || finalResponse['buyAmount'])
      ) {
        Object.keys(finalResponse).forEach((key) => {
          if (
            finalResponse[key] === null ||
            finalResponse[key] === '' ||
            finalResponse[key] === 0
          ) {
            delete finalResponse[key]
          }
        })

        Axios({ ...getExchangeAmountURL, data: finalResponse })
          .then((res) => {
            const response = res?.data?.data
            setControlsValue(false, response)
            setIsLoading(false)
          })
          .catch((_err) => {})
          .finally(() => {
            setIsLoading(false)
          })
      } else {
        setIsLoading(false)
      }
    }
  }

  const handleSelectChange = debounce(() => {
    conversionApiCall()
  }, 500)

  const handleInputChange = debounce((controlType) => {
    if (controlType === 'buyAmount') {
      setValue('sellAmount', '')
    } else {
      setValue('buyAmount', '')
    }
    conversionApiCall()
  }, 500)

  return (
    <div id="conversionSection" className="my-5 container">
      <div className="row justify-content-center">
        <h2 className="fw-bold"> Conversion </h2>

        <CForm>
          <CCard className="mt-2">
            <CCardBody>
              <div className="row conversionSection">
                <div className="col-md-5 conversion-control">
                  <div className="mb-3">
                    <Controller
                      control={conversionControl}
                      name="base_currency"
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <CurrencySelect
                            label="Currency"
                            value={field.value}
                            defaultValue={watch('base_currency') ?? undefined}
                            handleOnChange={(newValue) => {
                              field.onChange(newValue?.code)
                              handleSelectChange()
                            }}
                            // style={{ height: '45px' }}
                          />
                        </>
                      )}
                    />
                  </div>
                  <div>
                    <HFTextField
                      id="sellAmount"
                      name="sellAmount"
                      label="Amount"
                      control={conversionControl}
                      isController={true}
                      handleOnChange={(e) => {
                        handleInputChange('sellAmount')
                      }}
                      // style={{ height: '45px' }}
                    />
                  </div>
                </div>

                <div className="col-md-1 d-flex justify-content-center mt-2">
                  <button
                    className="swipBtn"
                    onClick={(e) => {
                      swipeBtnClick(e)
                    }}
                  >
                    <div className="arrow-icon">
                      {isLoading ? (
                        <CSpinner component="span" size="sm" aria-hidden="true" className="m-2" />
                      ) : (
                        <>
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            min={0}
                            viewBox="0 0 512 512"
                            height="0.9em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"></path>
                          </svg>
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 512 512"
                            height="0.9em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"></path>
                          </svg>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                <div className="col-md-5 conversion-control">
                  <div className="mb-3">
                    <Controller
                      control={conversionControl}
                      name="destination_currency"
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <CurrencySelect
                            label="Currency"
                            value={field.value}
                            defaultValue={watch('destination_currency') ?? undefined}
                            handleOnChange={(newValue) => {
                              field.onChange(newValue?.code)
                              handleSelectChange()
                            }}
                          />
                        </>
                      )}
                    />
                  </div>
                  <div>
                    <HFTextField
                      id="buyAmount"
                      name="buyAmount"
                      label="Amount"
                      control={conversionControl}
                      isController={true}
                      handleOnChange={(e) => {
                        handleInputChange('buyAmount')
                      }}
                    />
                  </div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CForm>
      </div>
    </div>
  )
}

export default ConversionSection
