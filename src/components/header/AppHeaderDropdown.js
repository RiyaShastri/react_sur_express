import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilPowerStandby, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { clearLogs } from 'redux/Actions/AuthActions'
import { ROLE_PERMISSIONS } from 'constants/permissions.constants'
import useModulePermissions from 'utils/hooks/useModulePermissions'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const { permissionCheck } = useModulePermissions()

  const handleBack = () => {
    dispatch(clearLogs())
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="p-0" caret={false}>
        <CAvatar color="primary" textColor="white" size="md">
          <CIcon icon={cilUser} size="lg" />
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="auth-user-dropdown" placement="bottom-end">
        {permissionCheck(ROLE_PERMISSIONS.PROFILE.VIEW) ? (
          <>
            <Link className="text-decoration-none" to="/profile">
              <CDropdownItem component="div">
                <CIcon icon={cilSettings} className="me-2" />
                Settings
              </CDropdownItem>
            </Link>
            <CDropdownDivider />
          </>
        ) : null}
        <CDropdownItem onClick={handleBack}>
          <CIcon icon={cilPowerStandby} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
