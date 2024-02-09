import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import DateTimePicker from 'react-datetime-picker'

import { CFormFeedback, CFormLabel } from '@coreui/react'
import { MdClear, MdOutlineDateRange } from 'react-icons/md'

import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'

const HFDateTimePicker = ({
  isController = false,
  id,
  name,
  label,
  control,
  minDate,
  defaultValue,
  handleOnChange,
  autoFocus = false,
  isDisabled = false,
  ...props
}) => {
  if (!isController) {
    return (
      <div className="mb-3 d-flex flex-column">
        {label && <CFormLabel htmlFor={id}>{label}</CFormLabel>}
        <DateTimePicker
          id={id}
          name={name}
          autoFocus={autoFocus}
          disabled={isDisabled}
          format={'y-MM-dd h:mm:ss a'}
          minDate={minDate}
          dayPlaceholder="dd"
          monthPlaceholder="mm"
          yearPlaceholder="yyyy"
          className={'form-control'}
          clearIcon={<MdClear />}
          calendarIcon={<MdOutlineDateRange />}
          value={defaultValue}
          onChange={(date) => {
            if (handleOnChange) {
              handleOnChange(date ? date : undefined, name)
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
        <div className="mb-3 d-flex flex-column">
          <Fragment>
            <CFormLabel htmlFor={props.id}>{label}</CFormLabel>
            <DateTimePicker
              id={id}
              name={name}
              autoFocus={autoFocus}
              disabled={isDisabled}
              format={'y-MM-dd h:mm:ss a'}
              className={`form-control ${!!error ? 'is-invalid' : ''}`}
              clearIcon={<MdClear />}
              calendarIcon={<MdOutlineDateRange />}
              minDate={minDate}
              dayPlaceholder="dd"
              monthPlaceholder="mm"
              yearPlaceholder="yyyy"
              value={field.value}
              onChange={(date) => {
                field.onChange(date ? date : undefined)
                return !handleOnChange
                  ? field.onChange(date ? date : undefined)
                  : handleOnChange(date, name)
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

HFDateTimePicker.propTypes = {
  autoFocus: PropTypes.bool,
  control: PropTypes.any,
  defaultValue: PropTypes.any,
  handleOnChange: PropTypes.func,
  id: PropTypes.any,
  isController: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.any,
  minDate: PropTypes.any,
  name: PropTypes.any,
}

export default HFDateTimePicker
