import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import {
  CButton,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'

import { HFDatePicker, LoadingButton } from 'components'

const createStatementSchema = Yup.object().shape({
  from: Yup.date().required('Start date is required').max(new Date(), 'Please select valid date'),
  to: Yup.date()
    .required('End date is required')
    .min(Yup.ref('from'), "End date can't be before start date")
    .max(new Date(), 'Please select valid date'),
})

const CreateStatementModel = () => {
  const [showModel, setShowModel] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const initialValues = {
    from: '',
    to: '',
  }

  const {
    reset,
    handleSubmit,
    control: statementControl,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(createStatementSchema),
  })

  const handleOpen = () => {
    setShowModel(true)
  }

  const handleClose = () => {
    setShowModel(false)
    reset(initialValues)
  }

  const handleCreateStatement = (data) => {
    setIsLoading(true)
    console.log('data :>> ', data)
    // Todo: API integration to create statement
    handleClose()
    setIsLoading(false)
  }

  return (
    <>
      <CButton size="sm" color="primary" onClick={handleOpen}>
        <CIcon icon={cilPlus} size="sm" /> Create
      </CButton>
      {showModel && (
        <CModal backdrop="static" alignment="center" visible={showModel} onClose={handleClose}>
          <CModalHeader>
            <CModalTitle>Create a Statement</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={handleSubmit(handleCreateStatement)}>
            <CModalBody>
              <div className="row">
                <div className="col-12">
                  <HFDatePicker
                    id="from"
                    name="from"
                    label="From"
                    control={statementControl}
                    isController={true}
                  />
                </div>
                <div className="col-12">
                  <HFDatePicker
                    id="to"
                    name="to"
                    label="To"
                    control={statementControl}
                    isController={true}
                  />
                </div>
              </div>
            </CModalBody>
            <CModalFooter>
              <LoadingButton
                loading={isLoading}
                disabled={!isValid}
                color="primary"
                type="submit"
                className="px-4 ms-auto"
              >
                Create
              </LoadingButton>
            </CModalFooter>
          </CForm>
        </CModal>
      )}
    </>
  )
}

export default CreateStatementModel
