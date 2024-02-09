import React from 'react'
import { useLocation, Link } from 'react-router-dom'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

import PrivateRoutes from 'router/PrivateRoutes'
import { useAuthUser } from 'utils/context/AuthUserContext'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const { authUser, authType } = useAuthUser()

  const routes = PrivateRoutes({ authUser, authType })

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => {
      if (route?.isID === true && pathname === route?.cruxPath) {
        return true
      }
      return route.path === pathname
    })

    return currentRoute ? currentRoute : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const currentRoute = getRouteName(currentPathname, routes)
      currentRoute &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: currentRoute.name,
          active: index + 1 === array.length ? true : false,
          isID: currentRoute?.isID,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem>
        <Link to="/dashboard">Home</Link>
      </CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem {...(breadcrumb.active ? { active: true } : null)} key={index}>
            {breadcrumb?.active || breadcrumb?.isID ? (
              breadcrumb.name
            ) : (
              <Link to={breadcrumb.pathname}>{breadcrumb.name}</Link>
            )}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
