import React from 'react'
import { PropTypes } from 'prop-types'

import { CButton, CSpinner } from '@coreui/react'

const LoadingButton = ({ loading = false, ...props }) => {
  return (
    <CButton {...props} disabled={loading || props.disabled}>
      {loading ? (
        <CSpinner component="span" size="sm" aria-hidden="true" className="mx-4" />
      ) : (
        props.children
      )}
    </CButton>
  )
}

LoadingButton.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
}

export default LoadingButton
