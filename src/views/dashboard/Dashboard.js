import {
  CCard,
  CCardBody,
  // CCardHeader
} from '@coreui/react'
import React from 'react'

const Dashboard = () => {
  return (
    <>
      <CCard>
        {/* <CCardHeader className="bg-white mx-2">
          <div className="text-primary fs-4 fw-bold">Dashboard</div>
        </CCardHeader> */}
        <CCardBody>
          <div className="mx-2">Dashboard</div>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
