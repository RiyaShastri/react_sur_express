import React from 'react'
import PropTypes from 'prop-types'

import HomeHeader from './components/HomeHeader'

const HomeWrapper = ({ children }) => {
  return (
    <>
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <HomeHeader />
        <div className="body flex-grow-1">{children}</div>
        {/* footer */}
      </div>
    </>
  )
}

HomeWrapper.propTypes = {
  children: PropTypes.node,
}

export default HomeWrapper
