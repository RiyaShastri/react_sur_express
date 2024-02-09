export const taxListURL = {
  url: 'tax/find',
  method: 'POST',
}

export const taxAddURL = {
  url: 'tax/create',
  method: 'POST',
}

export const getTaxByIDURL = (id) => ({
  url: `tax/${id}`,
  method: 'GET',
})

export const deleteTaxByIDURL = (id) => ({
  url: `tax/${id}`,
  method: 'DELETE',
})

export const updateTaxByIDURL = (id) => ({
  url: `tax/${id}`,
  method: 'PATCH',
})
