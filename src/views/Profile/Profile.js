import React from 'react'

import { CCard, CCardBody, CCardHeader } from '@coreui/react'

import { Spinner } from 'components'
import { useAuthUser } from 'utils/context/AuthUserContext'

import UserDetailForm from './UserDetailForm'
import ChangePasswordForm from './ChangePasswordForm'

const Profile = () => {
  const { isFetching } = useAuthUser()
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="bg-white mx-2">
          <h4 className="text-primary fw-bold mb-0">User</h4>
        </CCardHeader>
        <CCardBody>
          {isFetching ? (
            <div className="my-3">
              <Spinner />
            </div>
          ) : (
            <div className="row">
              <div className="col-md-6">
                <UserDetailForm />
              </div>
              <div className="col-md-6">
                <ChangePasswordForm />
              </div>
            </div>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Profile
