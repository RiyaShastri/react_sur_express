import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import AppointmentSection from './AppointmentSection'
import Axios from 'services/api/Config'
import { storeListURL } from 'services/api/routes/store'
import { STORE_STATUS } from 'constants/Store.constant'
import { FaUser, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import AppointmentForm from './AppointmentForm'

const StoresSection = () => {
  const [isOpenModal, setIsOpenModal] = useState({ open: false, storeId: '' })
  const [storeList, setStoreList] = useState()

  const obj = useMemo(
    () => ({
      options: {
        sort: { name: 1 },
        pagination: false,
        limit: 1,
        created_at: -1,
        populate: [
          { path: 'countryDetails' },
          { path: 'provinceDetails' },
          { path: 'cityDetails' },
          { path: 'contactPerson' },
        ],
      },

      query: { status: STORE_STATUS.ACTIVE },
    }),
    [],
  )

  const getStore = useCallback(() => {
    Axios({ ...storeListURL, data: obj }).then((res) => {
      const list = res.data.data.list
      setStoreList(list)
    })
  }, [obj])

  useEffect(() => {
    getStore()
  }, [getStore])

  return (
    <>
      <div id="storeSection" className="my-5 container">
        <h2 className="fw-bold"> Our Store </h2>

        <CRow className="w-100 m-0 px-0">
          <CCol className="mb-2 ps-0" md={4} lg={4} sm={1}>
            {storeList &&
              storeList.length > 0 &&
              storeList.map((opt) => {
                return (
                  <CCard className="h-100 " key={opt._id}>
                    <CCardHeader>
                      <span className="d-flex align-item-center text-primary fw-bold">
                        {opt.name}
                      </span>
                    </CCardHeader>
                    <CCardBody>
                      <div className="d-flex align-items-top mt-2">
                        <FaMapMarkerAlt className="h3" style={{ flex: '0 0 15px' }} />
                        <span className=" ps-3 text-medium-emphasis">
                          {`${opt.address_line_1}
                            ${opt?.address_line_2 && ', ' + opt.address_line_2}
                            ${opt?.cityDetails?.name && ', ' + opt?.cityDetails?.name}
                            ${opt?.provinceDetails?.name && ', ' + opt?.provinceDetails?.name}
                            ${opt?.countryDetails?.name && ', ' + opt?.countryDetails?.name}`}
                        </span>
                      </div>

                      <div className="d-flex align-items-top mt-2">
                        <FaUser className="h3" style={{ flex: '0 0 15px' }} />
                        <span className="ps-3 text-medium-emphasis">
                          {opt?.contactPerson?.first_name}
                          {opt?.contactPerson?.last_name}
                        </span>
                      </div>

                      <div className="d-flex align-items-top mt-2">
                        <FaPhoneAlt className="h3" style={{ flex: '0 0 15px' }} />
                        <span className=" text-medium-emphasis">
                          <span className=" ps-3 text-medium-emphasis">
                            {opt?.contactPerson?.mobile}
                          </span>
                        </span>
                      </div>

                      <div className="d-flex align-items-top mt-2">
                        <FaEnvelope className="h3" style={{ flex: '0 0 15px' }} />
                        <span className=" ps-3 text-medium-emphasis">
                          {opt?.contactPerson?.email}
                        </span>
                      </div>
                    </CCardBody>
                    {/* <CCardFooter>
                        <CButton
                          color="primary"
                          type="submit"
                          className="w-100"
                          onClick={() => setIsOpenModal({ open: true, storeId: opt._id })}
                        >
                          Book Appointment
                        </CButton>
                      </CCardFooter> */}
                  </CCard>
                )
              })}
          </CCol>
          <CCol className="mb-2 pe-0" md={8} lg={8} sm={1}>
            <AppointmentForm
              storeId={storeList && storeList?.length > 0 ? storeList[0]['_id'] : ''}
            />
          </CCol>
        </CRow>
      </div>

      {isOpenModal?.open && (
        <AppointmentSection isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      )}
    </>
  )
}

export default StoresSection
