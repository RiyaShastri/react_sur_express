import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'

import { CFormCheck, CFormFeedback } from '@coreui/react'

const HFCheckBox = ({
  id,
  name,
  label,
  control,
  handleOnChange,
  checked = false,
  autoFocus = false,
  isDisabled = false,
  isController = false,
  onChange,
  ...extraProps
}) => {
  if (!isController) {
    return (
      <Fragment>
        <div className="mt-4">
          <CFormCheck
            {...extraProps}
            id={id}
            name={name}
            label={label}
            autoFocus={autoFocus}
            disabled={isDisabled}
            readOnly={isDisabled}
            checked={checked}
            onChange={(_) => {
              if (handleOnChange) {
                handleOnChange(_.target.checked, name)
              }
            }}
          />
        </div>
      </Fragment>
    )
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Fragment>
          <div className="mt-4">
            <CFormCheck
              {...field}
              {...extraProps}
              id={id}
              name={name}
              label={label}
              autoFocus={autoFocus}
              disabled={isDisabled}
              readOnly={isDisabled}
              checked={field.value}
              onChange={(_) => {
                field.onChange(_.target.checked)
                return !handleOnChange
                  ? field.onChange(_.target.checked)
                  : handleOnChange(_.target.checked, name)
              }}
            />
            {error && (
              <CFormFeedback className="small text-danger" type="invalid">
                {error?.message}
              </CFormFeedback>
            )}
          </div>
        </Fragment>
      )}
    />
  )
}

HFCheckBox.propTypes = {
  checked: PropTypes.bool,
  control: PropTypes.any,
  isController: PropTypes.bool,
  isDisabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  label: PropTypes.any,
  name: PropTypes.any,
  id: PropTypes.any,
  handleOnChange: PropTypes.any,
  onChange: PropTypes.func,
}

export default HFCheckBox
