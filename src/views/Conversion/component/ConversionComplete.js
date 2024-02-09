import React from 'react'
import PropTypes from 'prop-types'

import { CButton, CCard, CCardBody, CCardFooter } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLoopCircular, cilTags } from '@coreui/icons'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { CONVERSION_STATUS } from 'constants/conversion.constant'

const ConversionComplete = ({ setStep, conversion, clearForm }) => {
  return (
    <CCard>
      <CCardBody>
        <div className="row">
          <div className="col-12">
            <h5 className="fw-bold text-primary">
              <CIcon icon={cilLoopCircular} size="lg" /> Conversion
            </h5>
            <div className="ms-4">
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Sold:</span>
                <span>
                  {conversion.client_sell_amount} (<b>{conversion.sell_currency}</b>)
                </span>
              </div>
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Bought:</span>
                <span>
                  {conversion.client_buy_amount} (<b>{conversion.buy_currency}</b>)
                </span>
              </div>
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Status:</span>
                <span>{CONVERSION_STATUS[conversion.status]}</span>
              </div>
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Created Date:</span>
                <span>{moment(conversion.created_at).format('DD MMM YYYY')}</span>
              </div>
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Settlement Date:</span>
                <span>{moment(conversion.settlement_date).format('DD MMM YYYY')}</span>
              </div>
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Conversion Date:</span>
                <span>{moment(conversion.conversion_date).format('DD MMM YYYY')}</span>
              </div>
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Reference #:</span>
                <span>{conversion.short_reference}</span>
              </div>
            </div>
            <h5 className="fw-bold text-primary">
              <CIcon icon={cilTags} size="lg" /> Rates
            </h5>
            <div className="ms-4">
              <div className="mb-2 fw-5">
                <span className="fw-bold me-2">Your Exchange Rate:</span>
                <span>
                  {`${conversion.client_rate} (Inverse: ${(
                    1 / Number(conversion.client_rate)
                  ).toFixed(3)}) on ${moment(conversion.conversion_date).format('DD MMM YYYY')}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CCardBody>
      <CCardFooter className="bg-white d-flex">
        <CButton
          className="px-4 me-3"
          color="primary"
          onClick={() => {
            clearForm()
            setStep(1)
          }}
        >
          Make Another Conversion
        </CButton>
        <Link to={'/dashboard'}>
          <CButton className="px-4 me-3" color="primary">
            View Dashboard
          </CButton>
        </Link>
      </CCardFooter>
    </CCard>
  )
}

ConversionComplete.propTypes = {
  clearForm: PropTypes.any,
  conversion: PropTypes.any,
  setStep: PropTypes.any,
}

export default ConversionComplete
