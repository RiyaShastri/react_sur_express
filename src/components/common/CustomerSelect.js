import React, { Fragment, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Select, { components } from 'react-select'

import { CFormLabel } from '@coreui/react'

import Axios from 'services/api/Config'
import { getSelectOptions } from 'utils/Common'
import { customerListURL } from 'services/api/routes/customer'

const CustomerSelect = ({
  id,
  label = 'Select Customer',
  defaultValue = null,
  handleOnChange,
  isDisabled = false,
  isError = false,
}) => {
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [defaultVal, setDefault] = useState(null)

  const obj = useMemo(
    () => ({
      options: {
        sort: { name: 1 },
        pagination: false,
        select: {
          first_name: 1,
          last_name: 1,
          IdNumber: 1,
          verified: 1,
        },
        populate: [],
      },
      query: {},
    }),
    [],
  )

  const handleDefaultValue = (defaultValue, list) => {
    const result = list.find((customer) => customer?._id === defaultValue)
    return { ...result, label: result.first_name, value: result._id }
  }

  useEffect(() => {
    setIsLoading(true)
    setDefault(null)
    Axios({ ...customerListURL, data: obj })
      .then((res) => {
        const list = res.data.data.list
        setOptions(getSelectOptions(list, 'first_name', '_id'))
        setDefault(handleDefaultValue(defaultValue, list))
      })
      .catch((_err) => {})
      .finally(() => {
        setIsLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obj])

  const customFilter = (option, searchText) => {
    if (
      option.data.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      option.data.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      option.data.IdNumber.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return true
    }
    return false
  }

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

  return (
    <Fragment>
      <div>
        {label && <CFormLabel htmlFor={id}>{label}</CFormLabel>}
        <Select
          id={id}
          value={defaultVal}
          options={options}
          isDisabled={isDisabled}
          menuPosition="fixed"
          isClearable={true}
          isLoading={isLoading}
          menuShouldBlockScroll={true}
          onChange={(data) => {
            if (handleOnChange) {
              handleOnChange(data)
              setDefault(data)
            }
          }}
          filterOption={customFilter}
          isOptionDisabled={(option) => !option.verified}
          styles={customStyles}
          theme={themeStyle}
          components={{ Option: SelectCustomOptions, SingleValue: CustomSingleValue }}
        />
      </div>
    </Fragment>
  )
}
const CustomSingleValue = (props) => (
  <components.SingleValue {...props}>
    {props?.data?.first_name} {props?.data?.last_name} ({props?.data?.IdNumber})
  </components.SingleValue>
)

const SelectCustomOptions = (props) => {
  return (
    <components.Option {...props}>
      {props?.data?.first_name} {props?.data?.last_name} ({props?.data?.IdNumber})
    </components.Option>
  )
}

CustomSingleValue.propTypes = {
  data: PropTypes.any,
}

SelectCustomOptions.propTypes = {
  data: PropTypes.any,
}

CustomerSelect.propTypes = {
  defaultValue: PropTypes.string,
  handleOnChange: PropTypes.func,
  id: PropTypes.any,
  isDisabled: PropTypes.bool,
  isError: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
}

export default CustomerSelect
