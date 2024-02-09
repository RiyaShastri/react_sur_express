export const customerRequestListURL = {
  url: 'customerRequest/find',
  method: 'POST',
}

export const customerRequestAddURL = {
  url: 'customerRequest/create',
  method: 'POST',
}

export const updateCustomerRequestByIDURL = (id) => ({
  url: `customerRequest/${id}`,
  method: 'PATCH',
})
