import React, { Fragment, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import { CFormLabel } from '@coreui/react'

import Axios from 'services/api/Config'
import { getSelectOptions } from 'utils/Common'
import { cityListURL } from 'services/api/routes/common'

const CitySelect = ({
  id,
  countryCode,
  provinceCode,
  label = 'Select City',
  defaultValue = null,
  handleOnChange,
  isDisabled = false,
  isError = false,
}) => {
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [defaultVal, setDefault] = useState(null)

  const obj = useCallback(() => {
    return {
      options: {
        limit: 15,
        page: 1,
        sort: { name: 1 },
        pagination: true,
      },
      query: {
        countryId: countryCode,
        provinceId: provinceCode,
      },
      search: {
        keys: ['name'],
        value: '',
      },
    }
  }, [countryCode, provinceCode])

  const handleDefaultValue = (defaultValue, list) => {
    const result = list.find((state) => state.cityId === defaultValue)
    return { ...result, label: result.name, value: result.cityId }
  }

  const fetch = (value) => {
    if (countryCode && provinceCode && value) {
      setIsLoading(true)
      setDefault(null)
      let tObj = {
        ...obj(),
        search: {
          ...obj().search,
          value: value,
        },
      }

      Axios({ ...cityListURL, data: tObj })
        .then((res) => {
          const list = res.data.data.list
          setOptions(getSelectOptions(list, 'name', 'cityId'))
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

  const handleSearch = (val) => {
    if (val) {
      fetch(val)
    }
  }

  const fetchOne = useCallback(() => {
    if (countryCode && provinceCode) {
      setOptions([])
      setIsLoading(true)
      setOptions([])
      setDefault(null)
      let tObj = {
        ...obj(),
        query: {
          ...obj().query,
          cityId: defaultValue,
        },
      }

      Axios({ ...cityListURL, data: tObj })
        .then((res) => {
          const list = res.data.data.list
          setOptions(getSelectOptions(list, 'name', 'cityId'))
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
  }, [countryCode, defaultValue, obj, provinceCode])

  useEffect(() => {
    if (!countryCode || !provinceCode) {
      setDefault(null)
      setOptions([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode, provinceCode])

  useEffect(() => {
    if (countryCode && provinceCode && defaultValue) {
      fetchOne()
    }
  }, [countryCode, provinceCode, defaultValue, fetchOne])

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
          isDisabled={isDisabled || !countryCode || !provinceCode}
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
          onInputChange={handleSearch}
          styles={customStyles}
          theme={themeStyle}
        />
      </div>
    </Fragment>
  )
}

CitySelect.propTypes = {
  defaultValue: PropTypes.string,
  handleOnChange: PropTypes.func,
  id: PropTypes.any,
  isDisabled: PropTypes.bool,
  isError: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  countryCode: PropTypes.string,
  provinceCode: PropTypes.string,
}

export default CitySelect
