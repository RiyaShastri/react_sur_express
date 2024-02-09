import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTimer } from 'react-timer-hook'

const OTPTimer = ({ expiryTimestamp, timerEnd, restartTimer }) => {
  const [times, setTimes] = useState(1)

  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp,
    onExpire: timerEnd,
  })

  useEffect(() => {
    if (restartTimer && times === 1) {
      const time = new Date()
      time.setSeconds(time.getSeconds() + 120)
      restart(time)
      setTimes(2)
    }
  }, [restart, restartTimer, times])

  return (
    <>
      <div>
        OTP will expire in: <span className="fw-bold">{minutes}</span>:
        <span className="fw-bold">{seconds}</span>
      </div>
    </>
  )
}

OTPTimer.propTypes = {
  expiryTimestamp: PropTypes.any,
  restartTimer: PropTypes.any,
  timerEnd: PropTypes.any,
}

export default OTPTimer
