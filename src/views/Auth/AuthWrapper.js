import PropTypes from 'prop-types'
import { CCard, CCardGroup, CCol, CContainer, CRow } from '@coreui/react'
import React from 'react'

const AuthWrapper = ({ children }) => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} lg={5}>
            <CCardGroup>
              <CCard className="p-4">{children}</CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

AuthWrapper.propTypes = {
  children: PropTypes.node,
}

export default AuthWrapper
