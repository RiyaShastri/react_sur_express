import { getDataFromObject } from 'utils/Common'
import { usePermission } from 'utils/context/PermissionContext'

const useModulePermissions = () => {
  const { permissions } = usePermission()

  const permissionCheck = (slug) => {
    if (slug !== true) {
      return getDataFromObject(permissions, slug)
    }
    return true
  }

  return { permissionCheck }
}

export default useModulePermissions
