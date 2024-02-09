import React, { Fragment } from 'react'
import { Controller } from 'react-hook-form'
import { PropTypes } from 'prop-types'

import { CFormFeedback, CFormInput } from '@coreui/react'

const HFTextInput = ({ isController = true, ...props }) => {
  const {
    name,
    control,
    defaultValue,
    type = 'text',
    handleOnChange,
    autoFocus = false,
    isDisabled = false,
    ...extraProps
  } = props

  if (!isController) {
    return (
      <div className={extraProps.label && 'mb-3'}>
        <CFormInput
          {...extraProps}
          type={type}
          autoFocus={autoFocus}
          readOnly={isDisabled}
          disabled={isDisabled}
          onChange={(data) => {
            if (handleOnChange) {
              handleOnChange(data?.target?.value, name)
            }
          }}
        />
      </div>
    )
  }

  let someValue = ''

  if (defaultValue !== undefined) {
    someValue = defaultValue
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={someValue}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-3">
          <Fragment>
            <CFormInput
              autoComplete="off"
              {...field}
              {...extraProps}
              type={type}
              invalid={!!error}
              disabled={isDisabled}
              autoFocus={autoFocus}
              readOnly={isDisabled}
              onChange={(e) => {
                field.onChange(e.target.value)

                return !handleOnChange
                  ? field.onChange(e.target.value)
                  : handleOnChange(e?.target?.value, name)
              }}
            />
            {error && (
              <CFormFeedback className="small text-danger" type="invalid">
                {error.message}
              </CFormFeedback>
            )}
          </Fragment>
        </div>
      )}
    />
  )
}

HFTextInput.propTypes = {
  autoFocus: PropTypes.bool,
  control: PropTypes.any,
  defaultValue: PropTypes.any,
  isDisabled: PropTypes.bool,
  disabled: PropTypes.bool,
  handleOnChange: PropTypes.func,
  isController: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
}

export default HFTextInput
