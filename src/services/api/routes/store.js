export const storeListURL = {
  url: 'store/find',
  method: 'POST',
}

export const storeAddURL = {
  url: 'store/create',
  method: 'POST',
}

export const getStoreByIDURL = (id) => ({
  url: `store/${id}`,
  method: 'GET',
})

export const updateStoreByIDURL = (id) => ({
  url: `store/${id}`,
  method: 'PATCH',
})
