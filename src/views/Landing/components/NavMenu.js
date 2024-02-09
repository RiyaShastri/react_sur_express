import PropTypes from 'prop-types'
import { CHeaderNav, CNavItem, CNavLink } from '@coreui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const NavMenu = ({ wrapperClass = '', list = false }) => {
  return (
    <CHeaderNav className={wrapperClass}>
      <div className={`me-auto mb-2 mb-md-0 ${list ? 'd-flex' : ''}`}>
        <CNavItem>
          <CNavLink href="#conversionSection">Conversion</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#storeSection">Stores</CNavLink>
        </CNavItem>
        {list && <div className="border mx-4"></div>}
        <CNavItem>
          <Link to={'/auth/login'} className="text-decoration-none">
            <span className="nav-link">Login</span>
          </Link>
        </CNavItem>
      </div>
    </CHeaderNav>
  )
}

NavMenu.propTypes = {
  list: PropTypes.bool,
  wrapperClass: PropTypes.string,
}

export default NavMenu
