import { CSpinner } from '@coreui/react'
import Logo from 'components/logo/Logo'
import React from 'react'

const BackdropLoader = () => {
  return (
    <div
      style={{ width: '100vw', height: '100vh' }}
      className="d-flex flex-column align-items-center justify-content-center"
    >
      <div>
        <Logo style={{ width: '350px' }} />
      </div>
      <div className="mt-3">
        <CSpinner component="span" aria-hidden="true" />
      </div>
    </div>
  )
}

export default BackdropLoader
