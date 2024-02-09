export const customerListURL = {
  url: 'customer/find',
  method: 'POST',
}

export const customerAddURL = {
  url: 'customer/create',
  method: 'POST',
}

export const verifyCustomerURL = {
  url: 'customer/verify',
  method: 'POST',
}

export const getCustomerByIDURL = (id) => ({
  url: `customer/${id}`,
  method: 'GET',
})

export const updateCustomerByIDURL = (id) => ({
  url: `customer/${id}`,
  method: 'PATCH',
})

export const deleteCustomerByIDURL = (id) => ({
  url: `customer/${id}`,
  method: 'DELETE',
})
