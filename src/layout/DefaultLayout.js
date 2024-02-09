import React from 'react'
import { AppContent, AppSidebar, AppHeader } from 'components/index'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 mx-4">
          <AppContent />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
