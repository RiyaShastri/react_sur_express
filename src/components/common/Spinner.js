import { CSpinner } from '@coreui/react'
import React from 'react'

const Spinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <CSpinner component="span" aria-hidden="true" />
    </div>
  )
}

export default Spinner
