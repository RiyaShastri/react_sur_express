import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import { CFormLabel } from '@coreui/react'

import Axios from 'services/api/Config'
import { getSelectOptions } from 'utils/Common'
import { provinceListURL } from 'services/api/routes/common'

const ProvinceSelect = ({
  id,
  countryCode,
  label = 'Select Province',
  defaultValue = null,
  handleOnChange,
  isDisabled = false,
  isError = false,
}) => {
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [defaultVal, setDefault] = useState(null)

  const obj = {
    options: {
      sort: {
        name: 1,
      },
      pagination: false,
      populate: [],
    },
    query: {
      countryId: countryCode,
    },
  }

  const handleDefaultValue = (defaultValue, list) => {
    const result = list.find((state) => state?._id === defaultValue)
    return { ...result, label: result.name, value: result._id }
  }

  const fetch = () => {
    if (countryCode) {
      setIsLoading(true)
      setDefault(null)
      Axios({ ...provinceListURL, data: obj })
        .then((res) => {
          const list = res.data.data.list
          setOptions(getSelectOptions(list, 'name', '_id'))
          setDefault(handleDefaultValue(defaultValue, list))
        })
        .catch((_err) => {})
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setOptions([])
      setDefault(null)
    }
  }

  React.useEffect(() => {
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode])

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
          isDisabled={isDisabled || !countryCode}
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
          styles={customStyles}
          theme={themeStyle}
        />
      </div>
    </Fragment>
  )
}

ProvinceSelect.propTypes = {
  defaultValue: PropTypes.string,
  handleOnChange: PropTypes.func,
  id: PropTypes.any,
  isDisabled: PropTypes.bool,
  isError: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  countryCode: PropTypes.string,
}

export default ProvinceSelect
