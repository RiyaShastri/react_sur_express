import React, { Fragment } from 'react'
import { Controller } from 'react-hook-form'
import { PropTypes } from 'prop-types'

import { CFormFeedback, CFormTextarea } from '@coreui/react'

const HFTextArea = ({ isController = true, ...props }) => {
  const {
    name,
    label,
    control,
    defaultValue,
    rows = 3,
    handleOnChange,
    autoFocus = false,
    isDisabled = false,
  } = props

  if (!isController) {
    return (
      <div className={label && 'mb-3'}>
        <CFormTextarea
          {...props}
          rows={rows}
          disabled={isDisabled}
          autoFocus={autoFocus}
          readOnly={isDisabled}
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
            <CFormTextarea
              autoComplete="off"
              {...field}
              {...props}
              rows={rows}
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

HFTextArea.propTypes = {
  autoFocus: PropTypes.bool,
  control: PropTypes.any,
  defaultValue: PropTypes.any,
  isDisabled: PropTypes.bool,
  disabled: PropTypes.bool,
  handleOnChange: PropTypes.func,
  isController: PropTypes.bool,
  label: PropTypes.string,
  rows: PropTypes.number,
  name: PropTypes.string.isRequired,
}

export default HFTextArea
