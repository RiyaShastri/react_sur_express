export const CUSTOMER_REQUEST_STATUS = {
  OPEN: 'Open',
  APPROVE: 'Approve',
  REJECT: 'Reject',
}

// export const CUSTOMER_REQUEST_STATUS_LABEL = {
//   [CUSTOMER_REQUEST_STATUS.OPEN]: 'Open',
//   [CUSTOMER_REQUEST_STATUS.APPROVE]: 'Approve',
//   [CUSTOMER_REQUEST_STATUS.REJECT]: 'Reject',
// }

export const CUSTOMER_REQUEST_STATUS_OPTIONS = [
  { value: CUSTOMER_REQUEST_STATUS.OPEN, label: CUSTOMER_REQUEST_STATUS.OPEN },
  { value: CUSTOMER_REQUEST_STATUS.APPROVE, label: CUSTOMER_REQUEST_STATUS.APPROVE },
  { value: CUSTOMER_REQUEST_STATUS.REJECT, label: CUSTOMER_REQUEST_STATUS.REJECT },
]

export const CUSTOMER_REQUEST_STATUS_OPTIONS_FILTERED = [
  { value: CUSTOMER_REQUEST_STATUS.APPROVE, label: CUSTOMER_REQUEST_STATUS.APPROVE },
  { value: CUSTOMER_REQUEST_STATUS.REJECT, label: CUSTOMER_REQUEST_STATUS.REJECT },
]
