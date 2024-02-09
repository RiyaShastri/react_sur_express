import React, { Fragment, useState } from 'react'
import { Controller } from 'react-hook-form'
import { PropTypes } from 'prop-types'
import CIcon from '@coreui/icons-react'

import { cilLockLocked, cilLockUnlocked } from '@coreui/icons'
import { CButton, CFormFeedback, CFormInput, CFormLabel, CInputGroup } from '@coreui/react'

const HFPassword = ({ isController = true, ...props }) => {
  const {
    name,
    label,
    control,
    defaultValue,
    handleOnChange,
    autoFocus = false,
    isDisabled = false,
    ...extraProps
  } = props

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  if (!isController) {
    return (
      <div className={label && 'mb-3'}>
        <CFormLabel htmlFor={props.id}>{label}</CFormLabel>
        <CInputGroup>
          <CFormInput
            {...extraProps}
            label=""
            type={isPasswordVisible ? 'text' : 'password'}
            autoFocus={autoFocus}
            readOnly={isDisabled}
            disabled={isDisabled}
            onChange={(data) => {
              if (handleOnChange) {
                handleOnChange(data?.target?.value, name)
              }
            }}
          />
          <CButton
            type="button"
            variant="outline"
            disabled={isDisabled}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            id="password-toggle"
          >
            <CIcon icon={isPasswordVisible ? cilLockUnlocked : cilLockLocked} />
          </CButton>
        </CInputGroup>
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
            <CInputGroup>
              <CFormInput
                autoComplete="off"
                {...field}
                {...extraProps}
                label=""
                type={isPasswordVisible ? 'text' : 'password'}
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
              <CButton
                type="button"
                variant="outline"
                disabled={isDisabled}
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                id={`${props.id}-toggle`}
              >
                <CIcon icon={isPasswordVisible ? cilLockUnlocked : cilLockLocked} />
              </CButton>
            </CInputGroup>
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

HFPassword.propTypes = {
  autoFocus: PropTypes.bool,
  control: PropTypes.any,
  defaultValue: PropTypes.any,
  isDisabled: PropTypes.bool,
  disabled: PropTypes.bool,
  handleOnChange: PropTypes.func,
  isController: PropTypes.bool,
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
}

export default HFPassword
