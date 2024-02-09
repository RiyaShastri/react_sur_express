import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-date-picker'
import { Controller } from 'react-hook-form'

import { CFormFeedback, CFormLabel } from '@coreui/react'
import { MdClear, MdOutlineDateRange } from 'react-icons/md'

import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import moment from 'moment/moment'

const HFDatePicker = ({
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
        <DatePicker
          id={id}
          name={name}
          autoFocus={autoFocus}
          disabled={isDisabled}
          minDate={minDate}
          format={'dd/MM/yyyy'}
          className={'form-control'}
          clearIcon={<MdClear />}
          calendarIcon={<MdOutlineDateRange />}
          value={defaultValue}
          onChange={(date) => {
            if (handleOnChange) {
              handleOnChange(date ? moment(date).format('YYYY-MM-DD') : undefined, name)
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
            <DatePicker
              id={id}
              name={name}
              autoFocus={autoFocus}
              disabled={isDisabled}
              format={'dd/MM/yyyy'}
              minDate={minDate}
              className={`form-control ${!!error ? 'is-invalid' : ''}`}
              clearIcon={<MdClear />}
              calendarIcon={<MdOutlineDateRange />}
              value={field.value}
              onChange={(date) => {
                field.onChange(date ? moment(date).format('YYYY-MM-DD') : undefined)
                return !handleOnChange
                  ? field.onChange(date ? moment(date).format('YYYY-MM-DD') : undefined)
                  : handleOnChange(moment(date).format('YYYY-MM-DD'), name)
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

HFDatePicker.propTypes = {
  autoFocus: PropTypes.bool,
  control: PropTypes.any,
  defaultValue: PropTypes.any,
  handleOnChange: PropTypes.func,
  id: PropTypes.string,
  isController: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  minDate: PropTypes.any,
  name: PropTypes.any,
}

export default HFDatePicker
