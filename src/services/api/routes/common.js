export const countryListURL = {
  url: 'country/find',
  method: 'POST',
}

export const provinceListURL = {
  url: 'province/find',
  method: 'POST',
}

export const cityListURL = {
  url: 'city/find',
  method: 'POST',
}

export const currencyListURL = {
  url: 'currency/find',
  method: 'POST',
}

export const getCurrencyByIDURL = (id) => ({
  url: `currency/${id}`,
  method: 'GET',
})
