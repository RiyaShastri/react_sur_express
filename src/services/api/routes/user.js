export const userListURL = {
  url: 'user/find',
  method: 'POST',
}

export const userAddURL = {
  url: 'user/create',
  method: 'POST',
}

export const getUserByIDURL = (id) => ({
  url: `user/${id}`,
  method: 'GET',
})

export const updateUserByIDURL = (id) => ({
  url: `user/${id}`,
  method: 'PATCH',
})

export const updateUserProfileURL = {
  url: 'user/profile',
  method: 'PATCH',
}

export const updateUserPasswordURL = {
  url: 'authentication/change-password',
  method: 'POST',
}
