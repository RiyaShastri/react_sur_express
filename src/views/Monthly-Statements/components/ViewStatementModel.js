import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { CButton, CModal, CModalBody, CModalHeader, CModalTitle, CTooltip } from '@coreui/react'
import { SlEye } from 'react-icons/sl'

const ViewStatementModel = ({ link }) => {
  const [showModel, setShowModel] = useState(false)

  const handleOpen = () => {
    setShowModel(true)
  }

  const handleClose = () => {
    setShowModel(false)
  }

  return (
    <>
      <CTooltip content="View Statement">
        <CButton
          size="sm"
          color="primary"
          className="rounded-btn-pill"
          shape="rounded-pill"
          variant="ghost"
          // Todo: Add onclick handler to veiw statement (iframe)
          onClick={handleOpen}
        >
          <SlEye className="fs-5" />
        </CButton>
      </CTooltip>
      {showModel && (
        <CModal
          size="xl"
          backdrop="static"
          alignment="center"
          visible={showModel}
          onClose={handleClose}
        >
          <CModalHeader>
            <CModalTitle>Statement</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <iframe
              id="inlineFrameExample"
              title="Inline Frame Example"
              style={{ width: '100%', height: '80vh' }}
              src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              // src={link}
            ></iframe>
          </CModalBody>
        </CModal>
      )}
    </>
  )
}

ViewStatementModel.propTypes = {
  link: PropTypes.any,
}

export default ViewStatementModel
