import React from 'react'
import PropTypes from 'prop-types'

import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

import { LoadingButton } from 'components'

const AmountAlertModel = ({
  amount,
  showAmountAlert,
  onClose = () => {},
  onConfirm = () => {},
}) => {
  // const [isLoading, setIsLoading] = useState(false)

  const handleModelClose = () => {
    onClose()
  }

  const handleConfirm = (e) => {
    e?.preventDefault()
    // Todo: API call to send message to the store admin
    onConfirm()
    handleModelClose()
  }

  return (
    <CModal
      backdrop="static"
      alignment="center"
      visible={showAmountAlert}
      onClose={handleModelClose}
    >
      <CModalHeader>
        <CModalTitle>High Amount Alert</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="row">
          <p>The conversion amount {amount} is higher than the limit, inform the store admin.</p>
        </div>
      </CModalBody>
      <CModalFooter>
        <LoadingButton
          // loading={isLoading}
          // disabled={!isValid}
          color="primary"
          className="px-4 ms-auto"
          onClick={handleConfirm}
        >
          Confirm
        </LoadingButton>
      </CModalFooter>
    </CModal>
  )
}

AmountAlertModel.propTypes = {
  amount: PropTypes.any,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  showAmountAlert: PropTypes.any,
}

export default AmountAlertModel
