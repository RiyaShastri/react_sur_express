import React from 'react'
import { ROLE_PERMISSIONS } from 'constants/permissions.constants'
import { USER_TYPE } from 'constants/User.constant'

import StoreList from 'views/Store/StoreList'
import StoreAddEdit from 'views/Store/StoreAddEdit'
import UserList from 'views/User/UserList'
import Profile from 'views/Profile/Profile'
import StoreDetails from 'views/Store/StoreDetails'
import CustomerList from 'views/Customer/CustomerList'
import CustomerAddEdit from 'views/Customer/CustomerAddEdit'
import CustomersDetails from 'views/Customer/CustomersDetails'
import StoreTransactionsList from 'views/Transactions/StoreTransactionsList'
import CustomerRequests from 'views/Customer-Requests/CustomerRequests'
import FXConversion from 'views/Conversion/FXConversion'
import ConversionListing from 'views/Conversion/ConversionListing'
import ConversionRates from 'views/Conversion-Rates/ConversionRates'
import MonthlyStatements from 'views/Monthly-Statements/MonthlyStatements'

const Dashboard = React.lazy(() => import('../views/Dashboard/Dashboard'))

const PrivateRoutes = ({ authUser, authType }) => {
  return [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard, isRouteAccessible: true },

    // profile
    {
      path: '/profile',
      name: 'Profile',
      element: Profile,
      isRouteAccessible: ROLE_PERMISSIONS.PROFILE.VIEW,
    },

    // Stores
    {
      path: '/store',
      name: 'Store',
      element: StoreList,
      isRouteAccessible: authType === USER_TYPE.SUPER_ADMIN ? ROLE_PERMISSIONS.STORE.VIEW : false,
    },
    {
      path: '/store/add',
      name: 'Add Store',
      element: StoreAddEdit,
      isRouteAccessible: ROLE_PERMISSIONS.STORE.CREATE,
    },
    {
      isID: true,
      name: 'Edit Store',
      cruxPath: '/store/edit',
      path: '/store/edit/:storeId',
      element: StoreAddEdit,
      isRouteAccessible: ROLE_PERMISSIONS.STORE.CREATE,
    },
    {
      isID: true,
      name: 'Store Details',
      cruxPath: '/store/view',
      path: '/store/view/:storeId',
      element: StoreDetails,
      isRouteAccessible: ROLE_PERMISSIONS.STORE.VIEW,
    },

    // Users
    {
      path: '/user',
      name: 'Admin Users',
      element: UserList,
      isRouteAccessible: ROLE_PERMISSIONS.ADMIN_USERS.VIEW,
    },

    //Customer
    {
      path: '/customer',
      name: 'Customer',
      element: CustomerList,
      isRouteAccessible: ROLE_PERMISSIONS.CUSTOMER.VIEW,
    },
    {
      path: '/customer/add',
      name: 'Add Customer',
      element: CustomerAddEdit,
      isRouteAccessible: ROLE_PERMISSIONS.CUSTOMER.CREATE,
    },
    {
      isID: true,
      name: 'Edit Customer',
      cruxPath: '/customer/edit',
      path: '/customer/edit/:customerId',
      element: CustomerAddEdit,
      isRouteAccessible: ROLE_PERMISSIONS.CUSTOMER.CREATE,
    },
    {
      isID: true,
      name: 'Customer Details',
      cruxPath: '/customer/view',
      path: '/customer/view/:customerId',
      element: CustomersDetails,
      isRouteAccessible: ROLE_PERMISSIONS.CUSTOMER.VIEW,
    },

    // transactions
    {
      path: '/store-transaction',
      name: 'Store Transaction',
      element: StoreTransactionsList,
      isRouteAccessible:
        authType === USER_TYPE.SUPER_ADMIN ? ROLE_PERMISSIONS.STORE_TRANSACTION.VIEW : false,
    },

    // tax
    // {
    //   path: '/tax',
    //   name: 'Tax',
    //   element: TaxList,
    //   isRouteAccessible: true,
    // },

    // Conversion
    {
      path: '/conversion/create',
      name: 'FX Conversion',
      element: FXConversion,
      isRouteAccessible: true,
    },
    {
      path: '/conversion/list',
      name: 'Conversion List',
      element: ConversionListing,
      isRouteAccessible: true,
    },

    // Appointment
    // {
    //   path: '/appointments',
    //   name: 'Appointments',
    //   element: Appointments,
    //   isRouteAccessible: authType !== USER_TYPE.SUPER_ADMIN,
    // },

    // Customer request
    {
      path: '/customer-requests',
      name: 'Customer Requests',
      element: CustomerRequests,
      isRouteAccessible: authType !== USER_TYPE.SUPER_ADMIN,
    },

    // Conversion Rates
    {
      path: '/conversion-rates',
      name: 'Conversion Rates',
      element: ConversionRates,
      isRouteAccessible:
        authType === USER_TYPE.SUPER_ADMIN ? ROLE_PERMISSIONS.RATE_LIST.VIEW : false,
    },

    // Monthly Statements
    {
      path: '/monthly-statements',
      name: 'Monthly Statements',
      element: MonthlyStatements,
      isRouteAccessible:
        authType === USER_TYPE.SUPER_ADMIN ? ROLE_PERMISSIONS.RATE_LIST.VIEW : false,
    },
  ]
}

export default PrivateRoutes
