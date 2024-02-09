import React from 'react'
import PropTypes from 'prop-types'

import { toAbsoluteUrl } from 'utils/Common'

const CurrencyDetails = ({ currency }) => {
  return (
    <>
      <div className="d-flex align-items-center" style={{ height: '60px', overflow: 'hidden' }}>
        <img
          loading="lazy"
          width="60"
          src={toAbsoluteUrl(`/images/CurrencyFlags/${currency?.code}.png`)}
          alt={`${currency?.name} flag`}
          style={{ objectFit: 'cover' }}
        />
      </div>

      <h6 className="mt-2 mb-0">{currency?.code}</h6>
    </>
  )
}

CurrencyDetails.propTypes = {
  currency: PropTypes.any,
}

export default CurrencyDetails
