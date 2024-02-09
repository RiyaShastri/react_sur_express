import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import reportWebVitals from './reportWebVitals'

import 'react-app-polyfill/stable'
import 'core-js'

import App from './App'
import store from './redux/Store'
import { BackdropLoader } from 'components'
import { AuthUserProvider } from 'utils/context/AuthUserContext'

import './scss/style.scss'
import { PermissionProvider } from 'utils/context/PermissionContext'

createRoot(document.getElementById('root')).render(
  <Suspense fallback={<BackdropLoader />}>
    <Provider store={store}>
      <AuthUserProvider>
        <PermissionProvider>
          <App />
        </PermissionProvider>
      </AuthUserProvider>
    </Provider>
  </Suspense>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
