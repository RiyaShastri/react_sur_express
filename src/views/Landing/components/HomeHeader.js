import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { cilMenu } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CCloseButton,
  CContainer,
  CHeader,
  CHeaderToggler,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
} from '@coreui/react'

import NavMenu from './NavMenu'

const RenderImage = ({ className, url }) => {
  return <img className={className} src={url} alt="SurExpress Logo" style={{ height: '45px' }} />
}

const HomeHeader = () => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <CHeader position="fixed">
        <CContainer>
          <RenderImage
            className={'sidebar-brand-full d-none d-md-block'}
            url={'/images/Logo/SurExpress2.svg'}
          />
          <RenderImage
            className={'sidebar-brand-narrow d-block d-md-none'}
            url={'/images/Logo/fav-icon.svg'}
          />

          <NavMenu list={true} wrapperClass={'d-none d-md-block'} />

          <CHeaderToggler className="d-block d-md-none" onClick={() => setVisible(!visible)}>
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>

          <COffcanvas
            id="offcanvasNavbar"
            placement="end"
            portal={false}
            visible={visible}
            onHide={() => setVisible(false)}
          >
            <COffcanvasHeader>
              <COffcanvasTitle>
                <RenderImage
                  className={'sidebar-brand-full'}
                  url={'/images/Logo/SurExpress2.svg'}
                />
              </COffcanvasTitle>
              <CCloseButton className="text-reset" onClick={() => setVisible(false)} />
            </COffcanvasHeader>
            <COffcanvasBody>
              <NavMenu />
            </COffcanvasBody>
          </COffcanvas>
        </CContainer>
      </CHeader>
    </>
  )
}

RenderImage.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string,
}

export default HomeHeader
