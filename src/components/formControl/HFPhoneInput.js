import React, { Fragment } from 'react'
import PhoneInput from 'react-phone-input-2'
import { Controller } from 'react-hook-form'
import { PropTypes } from 'prop-types'

import { CFormFeedback, CFormLabel } from '@coreui/react'

import 'react-phone-input-2/lib/bootstrap.css'

const HFPhoneInput = ({ isController = true, ...props }) => {
  const {
    name,
    label,
    control,
    defaultValue,
    handleOnChange,
    autoFocus = false,
    isDisabled = false,
  } = props

  if (!isController) {
    return (
      <div className={label && 'mb-3'}>
        <CFormLabel htmlFor={props.id}>{label}</CFormLabel>
        <PhoneInput
          {...props}
          country={'us'}
          label="Phone number"
          disabled={isDisabled}
          autoFocus={autoFocus}
          inputClass="phone-number-input"
          inputStyle={{
            width: '100%',
            height: '40px',
          }}
          onChange={(phone) => {
            handleOnChange(phone, name)
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
            <CFormLabel htmlFor={props.id}>{label}</CFormLabel>
            <PhoneInput
              {...props}
              country={'us'}
              value={field.value}
              label="Phone number"
              autoFocus={autoFocus}
              disabled={isDisabled}
              inputClass={`phone-number-input ${!!error ? 'is-invalid' : ''}`}
              inputStyle={{
                width: '100%',
                height: '40px',
              }}
              onChange={(phone) => {
                field.onChange(phone)
                return !handleOnChange ? field.onChange(phone) : handleOnChange(phone, name)
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

HFPhoneInput.propTypes = {
  autoFocus: PropTypes.bool,
  control: PropTypes.any,
  defaultValue: PropTypes.any,
  id: PropTypes.any,
  isDisabled: PropTypes.bool,
  disabled: PropTypes.bool,
  handleOnChange: PropTypes.func,
  isController: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
}

export default HFPhoneInput
