import React from 'react'

import { CNavGroup, CNavItem } from '@coreui/react'

import {
  MdStore,
  MdSupervisorAccount,
  MdDashboard,
  MdAccountBox,
  MdAccountBalanceWallet,
  MdCoPresent,
  MdAutorenew,
  MdCurrencyExchange,
  MdLibraryBooks,
} from 'react-icons/md'
import { ROLE_PERMISSIONS } from 'constants/permissions.constants'
import { USER_TYPE } from 'constants/User.constant'

const _nav = ({ authUser, authType }) => {
  return [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <MdDashboard className="nav-icon" />,
      isRouteAccessible: true,
    },
    {
      component: CNavItem,
      name: authType === USER_TYPE.SUPER_ADMIN ? 'Store' : 'Store Details',
      to: authType === USER_TYPE.SUPER_ADMIN ? '/store' : `/store/view/${authUser?.storeId}`,
      icon: <MdStore className="nav-icon" />,
      isRouteAccessible: ROLE_PERMISSIONS.STORE.VIEW,
    },
    {
      component: CNavItem,
      name: 'Admin Users',
      to: '/user',
      icon: <MdSupervisorAccount className="nav-icon" />,
      isRouteAccessible: ROLE_PERMISSIONS.ADMIN_USERS.VIEW,
    },
    {
      component: CNavItem,
      name: 'Store Transactions',
      to: '/store-transaction',
      icon: <MdAccountBalanceWallet className="nav-icon" />,
      isRouteAccessible:
        authType === USER_TYPE.SUPER_ADMIN ? ROLE_PERMISSIONS.STORE_TRANSACTION.VIEW : false,
    },
    // {
    //   component: CNavItem,
    //   name: 'Tax',
    //   to: '/tax',
    //   icon: <MdOutlineReceiptLong className="nav-icon" />,
    //   isRouteAccessible: true,
    // },
    {
      component: CNavItem,
      name: 'Customer',
      to: '/customer',
      icon: <MdAccountBox className="nav-icon" />,
      isRouteAccessible: ROLE_PERMISSIONS.CUSTOMER.VIEW,
    },
    {
      component: CNavGroup,
      name: 'Conversion',
      icon: <MdCurrencyExchange className="nav-icon" />,
      isRouteAccessible: true,
      items: [
        {
          component: CNavItem,
          name: 'FX Conversion',
          to: '/conversion/create',
        },
        {
          component: CNavItem,
          name: 'Conversions List',
          to: '/conversion/list',
        },
      ],
    },
    // {
    //   component: CNavItem,
    //   name: 'Appointments',
    //   to: '/appointments',
    //   icon: <MdOutlineAvTimer className="nav-icon" />,
    //   isRouteAccessible: authType !== USER_TYPE.SUPER_ADMIN,
    // },
    {
      component: CNavItem,
      name: 'Customer Requests',
      to: '/customer-requests',
      icon: <MdCoPresent className="nav-icon" />,
      isRouteAccessible: authType !== USER_TYPE.SUPER_ADMIN,
    },
    {
      component: CNavItem,
      name: 'Conversion Rates',
      to: '/conversion-rates',
      icon: <MdAutorenew className="nav-icon" />,
      isRouteAccessible:
        authType === USER_TYPE.SUPER_ADMIN ? ROLE_PERMISSIONS.RATE_LIST.VIEW : false,
    },
    {
      component: CNavItem,
      name: 'Monthly Statements',
      to: '/monthly-statements',
      icon: <MdLibraryBooks className="nav-icon" />,
      isRouteAccessible:
        authType === USER_TYPE.SUPER_ADMIN ? ROLE_PERMISSIONS.RATE_LIST.VIEW : false,
    },
  ]
}

export default _nav
