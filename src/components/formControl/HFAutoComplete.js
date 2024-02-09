import React, { Fragment } from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'

import { CFormFeedback, CFormLabel } from '@coreui/react'

const HFAutoComplete = ({
  id,
  name,
  label,
  isController = true,
  control,
  options = [],
  isError = false,
  onChange,
  limitTags = -1,
  handleOnChange,
  isRequired = true,
  isClearable = true,
  isSearchable = true,
  isLoading = false,
  isDisabled = false,
  isMultiple = false,
  defaultValue,
  inputNote = null,
  ...props
}) => {
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
    const result = options.find((obj) => obj?.value === defaultValue)
    return result
  }

  if (!isController) {
    return (
      <Fragment>
        <div>
          {label && <CFormLabel htmlFor={id}>{label}</CFormLabel>}
          <Select
            {...props}
            id={id}
            name={name}
            value={defaultValue ? handleDefaultValue(defaultValue) : undefined}
            options={options}
            isMulti={isMultiple}
            isLoading={isLoading}
            isDisabled={isDisabled}
            placeholder="Select..."
            isClearable={isClearable}
            isSearchable={isSearchable}
            menuPosition="fixed"
            menuShouldBlockScroll={true}
            onChange={(data) => {
              if (handleOnChange) {
                handleOnChange(data)
              }
            }}
            theme={themeStyle}
            styles={{
              control: (base, state) => ({
                ...base,
                boxShadow: state.isFocused && '0 0 0 0.25rem rgba(40, 46, 105, 0.25)',
                borderColor: (isError && state.isFocused) || isError ? '#ff715b' : '#b1b7c1',
              }),
            }}
          />
        </div>
      </Fragment>
    )
  }

  return (
    <>
      <Controller
        id={id || name}
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <Fragment>
              {label && <CFormLabel htmlFor={id}>{label}</CFormLabel>}
              <Select
                {...props}
                id={id}
                name={name}
                value={field.value ? handleDefaultValue(field.value) : undefined}
                isMulti={isMultiple}
                isLoading={isLoading}
                isDisabled={isDisabled}
                placeholder="Select..."
                isClearable={isClearable}
                isSearchable={isSearchable}
                options={options}
                onChange={(data, action) => {
                  field.onChange(data?.value)
                  if (handleOnChange) {
                    handleOnChange(data, name, action)
                  }
                }}
                theme={themeStyle}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    boxShadow: state.isFocused && '0 0 0 0.25rem rgba(40, 46, 105, 0.25)',
                    borderColor: (!!error && state.isFocused) || !!error ? '#ff715b' : '#b1b7c1',
                  }),
                }}
              />
              {error && !isDisabled && (
                <CFormFeedback className="small text-danger" type="invalid">
                  {error.message}
                </CFormFeedback>
              )}
            </Fragment>
          )
        }}
      />
      {inputNote && <small>{inputNote}</small>}
    </>
  )
}

HFAutoComplete.propTypes = {
  control: PropTypes.any,
  defaultValue: PropTypes.any,
  handleOnChange: PropTypes.func,
  id: PropTypes.any,
  inputNote: PropTypes.any,
  isClearable: PropTypes.bool,
  isController: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isMultiple: PropTypes.bool,
  isRequired: PropTypes.bool,
  isSearchable: PropTypes.bool,
  label: PropTypes.any,
  limitTags: PropTypes.any,
  name: PropTypes.any,
  onChange: PropTypes.any,
  options: PropTypes.array,
  placeholder: PropTypes.string,
}

export default HFAutoComplete
