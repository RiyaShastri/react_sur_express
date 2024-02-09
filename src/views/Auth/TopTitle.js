import React from 'react'
import { PropTypes } from 'prop-types'
import { Logo } from 'components'
import { Link } from 'react-router-dom'

const TopTitle = ({ title, subTitle }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center mb-3">
      <Link to={'/home'}>
        <Logo style={{ width: 150 }} />
      </Link>
      <h2 className="mb-2 text-primary">{title}</h2>
      {subTitle ? <div className="text-medium-emphasis mb-3">{subTitle}</div> : null}
    </div>
  )
}

TopTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.any,
}

export default TopTitle
