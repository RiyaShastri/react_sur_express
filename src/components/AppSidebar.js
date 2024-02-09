import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import _nav from '_nav'

import { toggleSideBar, toggleSideBarFold } from 'redux/Actions/GeneralActions'
import { useAuthUser } from 'utils/context/AuthUserContext'
const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.general.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.general.sidebarShow)

  const { authUser, authType } = useAuthUser()

  const navigation = _nav({ authUser, authType })

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(toggleSideBar(visible))
      }}
    >
      <CSidebarBrand className="d-none d-md-flex border" to="/">
        <img
          className="sidebar-brand-full"
          src="/images/Logo/SurExpress2.svg"
          alt="SurExpress Logo"
          style={{ height: '45px' }}
        />
        <img
          className="sidebar-brand-narrow"
          src="/images/Logo/fav-icon.svg"
          alt="SurExpress Logo"
          style={{ height: '45px' }}
        />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler className="d-none d-lg-flex" onClick={() => dispatch(toggleSideBarFold())} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
