export const currencyChargesListURL = {
  url: 'currencyCharges/find',
  method: 'POST',
}

export const updateCurrencyChargesByIDURL = (id) => ({
  url: `currencyCharges/${id}`,
  method: 'PATCH',
})

export const getCurrencyChargesByIDURL = (id) => ({
  url: `currencyCharges/${id}`,
  method: 'GET',
})
