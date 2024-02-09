import React from 'react'
import PropTypes from 'prop-types'
import { Stepper } from 'react-form-stepper'

const StepperBar = ({ label = [], currentStep = 0 }) => {
  const modLabels = label.map((val) => ({ label: val }))
  return (
    <div>
      <Stepper
        steps={modLabels}
        activeStep={currentStep}
        styleConfig={{
          // activeBgColor: '#282e69',
          activeBgColor: '#1f1498',
          completedBgColor: '#988fed',
        }}
      />
    </div>
  )
}

StepperBar.propTypes = {
  label: PropTypes.array,
  currentStep: PropTypes.number,
}

export default StepperBar
