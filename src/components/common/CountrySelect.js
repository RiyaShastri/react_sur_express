import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Select, { components } from 'react-select'
import { useSelector } from 'react-redux'

import { CFormLabel } from '@coreui/react'
import { getSelectOptions } from 'utils/Common'

const CountrySelect = ({
  id,
  label = 'Select Country',
  defaultValue = null,
  handleOnChange,
  isDisabled = false,
  isError = false,
}) => {
  const { country } = useSelector((state) => state.general)

  const customStyles = {
    control: (base, state) => ({
      ...base,
      boxShadow: state.isFocused && '0 0 0 0.25rem rgba(40, 46, 105, 0.25)',
      borderColor: (isError && state.isFocused) || isError ? '#ff715b' : '#b1b7c1',
    }),
  }
  const themeStyle = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: '#ccc7f6',
      primary50: '#988fed',
      primary75: '#282f69bf',
      primary: '#282e69',
      neutral5: '#D8DBE0',
      neutral40: '#354051',
    },
  })
  const handleDefaultValue = (defaultValue) => {
    const result = country.find((state) => state.countryId === defaultValue)
    return { ...result, label: result?.name, value: result?.countryId }
  }

  return (
    <Fragment>
      <div>
        {label && <CFormLabel htmlFor={id}>{label}</CFormLabel>}
        <Select
          id={id}
          value={defaultValue ? handleDefaultValue(defaultValue) : undefined}
          options={getSelectOptions(country, 'name', 'countryId')}
          isDisabled={isDisabled}
          isClearable={true}
          menuPosition="fixed"
          menuShouldBlockScroll={true}
          onChange={(data) => {
            if (handleOnChange) {
              handleOnChange(data)
            }
          }}
          styles={customStyles}
          theme={themeStyle}
          components={{ Option: SelectCustomOptions, SingleValue: CustomSingleValue }}
        />
      </div>
    </Fragment>
  )
}

const CustomSingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <img
      loading="lazy"
      width="20"
      src={`https://flagcdn.com/h24/${props?.data?.code?.toLowerCase()}.png`}
      alt={`${props?.data?.name} flag`}
    />{' '}
    {children}
  </components.SingleValue>
)

const SelectCustomOptions = (props) => {
  return (
    <components.Option {...props}>
      <img
        loading="lazy"
        width="20"
        src={`https://flagcdn.com/h24/${props?.data?.code?.toLowerCase()}.png`}
        alt={`${props?.data?.name} flag`}
      />{' '}
      {props?.children}
    </components.Option>
  )
}

CustomSingleValue.propTypes = {
  children: PropTypes.any,
  data: PropTypes.any,
}

SelectCustomOptions.propTypes = {
  children: PropTypes.any,
  data: PropTypes.any,
}

CountrySelect.propTypes = {
  defaultValue: PropTypes.string,
  handleOnChange: PropTypes.func,
  id: PropTypes.any,
  isDisabled: PropTypes.bool,
  isError: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
}

export default CountrySelect
