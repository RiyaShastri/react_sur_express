import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import {
  CForm,
  CFormFeedback,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'

import Axios from 'services/api/Config'
import { CurrencySelect, HFAutoComplete, HFTextField, LoadingButton, Toast } from 'components'
import { transactionAddURL } from 'services/api/routes/transaction'
import { TRANSACTION_TYPE_OPTIONS } from 'constants/transaction.constant'

const userAddEditSchema = Yup.object().shape({
  currencyCode: Yup.string().required('Currency is required'),
  type: Yup.string().required('Transaction Type is required'),
  amount: Yup.number().required('Amount is required'),
})

const TransactionAddModel = ({ isVisible = false, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)

  let { storeId } = useParams()

  const initialValues = {
    currencyCode: '',
    amount: 0,
    type: null,
    storeId: storeId,
  }

  const {
    reset,
    watch,
    handleSubmit,
    control: transactionControl,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(userAddEditSchema),
  })

  const onSubmit = (data) => {
    setIsLoading(true)
    Axios({ ...transactionAddURL, data: data })
      .then((res) => {
        Toast.success(res.data.message)
        reset(initialValues)
        onClose()
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleClose = () => {
    reset(initialValues)
    onClose()
  }

  return (
    <>
      <CModal backdrop="static" alignment="center" visible={isVisible} onClose={handleClose}>
        <CModalHeader>
          <CModalTitle>Add Transaction</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CModalBody>
            <>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <Controller
                    control={transactionControl}
                    name="currencyCode"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <CurrencySelect
                          label="Currency"
                          isError={!!error}
                          defaultValue={watch('currencyCode') ?? undefined}
                          handleOnChange={(newValue) => field.onChange(newValue?.code)}
                        />
                        {error && (
                          <CFormFeedback className="small text-danger" type="invalid">
                            {error.message}
                          </CFormFeedback>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="col-md-6">
                  <HFTextField
                    id="amount"
                    name="amount"
                    type="number"
                    label="Amount"
                    control={transactionControl}
                    isController={true}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <HFAutoComplete
                    id="type"
                    name="type"
                    label="Transaction type"
                    isController={true}
                    options={TRANSACTION_TYPE_OPTIONS}
                    control={transactionControl}
                  />
                </div>
              </div>
            </>
          </CModalBody>
          <CModalFooter className="d-flex">
            <LoadingButton
              loading={isLoading}
              disabled={!isValid}
              color="primary"
              type="submit"
              className="px-4 ms-auto"
            >
              Add Transaction
            </LoadingButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

TransactionAddModel.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.any,
}

export default TransactionAddModel
