import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Select, { components } from 'react-select'
import { useSelector } from 'react-redux'

import { CFormLabel } from '@coreui/react'
import { getSelectOptions, toAbsoluteUrl } from 'utils/Common'

const CurrencySelect = ({
  id,
  label = 'Select Currency',
  defaultValue = null,
  defaultCode = 'code',
  handleOnChange,
  isDisabled = false,
  isError = false,
}) => {
  const { currency } = useSelector((state) => state.general)

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

  const customFilter = (option, searchText) => {
    if (
      option.data.name.toLowerCase().includes(searchText.toLowerCase()) ||
      option.data.code.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return true
    }
    return false
  }

  const handleDefaultValue = (defaultValue) => {
    const result = currency.find((state) => state[defaultCode] === defaultValue)
    return { ...result, label: result.name, value: result[defaultCode] }
  }

  return (
    <Fragment>
      <div>
        {label && <CFormLabel htmlFor={id}>{label}</CFormLabel>}
        <Select
          id={id}
          value={defaultValue ? handleDefaultValue(defaultValue) : undefined}
          options={getSelectOptions(currency, 'name', defaultCode)}
          isDisabled={isDisabled}
          isClearable={true}
          menuPosition="fixed"
          menuShouldBlockScroll={true}
          onChange={(data) => {
            if (handleOnChange) {
              handleOnChange(data)
            }
          }}
          filterOption={customFilter}
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
      src={toAbsoluteUrl(`/images/CurrencyFlags/${props?.data?.code}.png`)}
      alt={`${props?.data?.name} flag`}
    />{' '}
    {children} ({props?.data?.code})
  </components.SingleValue>
)

const SelectCustomOptions = (props) => {
  return (
    <components.Option {...props}>
      <img
        loading="lazy"
        width="20"
        src={toAbsoluteUrl(`/images/CurrencyFlags/${props?.data?.code}.png`)}
        alt={`${props?.data?.name} flag`}
      />{' '}
      {props?.children} ({props?.data?.code})
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

CurrencySelect.propTypes = {
  defaultValue: PropTypes.string,
  handleOnChange: PropTypes.func,
  id: PropTypes.any,
  isDisabled: PropTypes.bool,
  isError: PropTypes.bool,
  label: PropTypes.string,
  defaultCode: PropTypes.string,
  placeholder: PropTypes.string,
}

export default CurrencySelect
