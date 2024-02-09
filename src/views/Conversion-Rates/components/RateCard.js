import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { CButton, CCard, CCardBody, CCol, CRow, CTooltip } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilColorBorder } from '@coreui/icons'

import CurrencyDetails from './CurrencyDetails'
import RightArrowForRate from './RightArrowForRate'
import { useAuthUser } from 'utils/context/AuthUserContext'
import { USER_TYPE } from 'constants/User.constant'
import UpdateRateModel from './UpdateRateModel'

const RateCard = ({ rateDetails, setRefreshToggle }) => {
  const { authType } = useAuthUser()
  const [changeRateModel, setChangeRateModel] = useState(null)

  const handleModelOpen = () => {
    setChangeRateModel(rateDetails)
  }

  const handleModelClose = () => {
    setChangeRateModel(null)
  }

  return (
    <>
      <CCard>
        <CCardBody>
          <CRow>
            <CCol className="d-flex flex-column align-items-center">
              <CurrencyDetails currency={rateDetails?.baseCurrencyDetails} />
            </CCol>
            <CCol className="d-flex flex-column align-items-center justify-content-center">
              <RightArrowForRate />
              <div className="d-flex align-items-center gap-1">
                <h6>{rateDetails?.percentage}%</h6>
                {authType === USER_TYPE.SUPER_ADMIN && (
                  <CTooltip content="Edit Rate" placement="bottom">
                    <CButton
                      size="sm"
                      color="primary"
                      className="rounded-btn-pill"
                      shape="rounded-pill"
                      variant="ghost"
                      onClick={handleModelOpen}
                    >
                      <CIcon icon={cilColorBorder} size="lg" />
                    </CButton>
                  </CTooltip>
                )}
              </div>
            </CCol>
            <CCol className="d-flex flex-column align-items-center">
              <CurrencyDetails currency={rateDetails?.destinationCurrencyDetails} />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {!!changeRateModel && (
        <UpdateRateModel
          changeRateModel={changeRateModel}
          setChangeRateModel={setChangeRateModel}
          onClose={handleModelClose}
          setRefreshToggle={setRefreshToggle}
        />
      )}
    </>
  )
}

RateCard.propTypes = {
  rateDetails: PropTypes.shape({
    baseCurrency: PropTypes.any,
    baseCurrencyDetails: PropTypes.any,
    destinationCurrency: PropTypes.any,
    destinationCurrencyDetails: PropTypes.any,
    percentage: PropTypes.any,
  }),
  setRefreshToggle: PropTypes.any,
}

export default RateCard
