import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import SmartBillProvider from './Context/SmartBillProvider'
import { RouterProvider } from 'react-router'
import router from './Router/Router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <SmartBillProvider>
    <RouterProvider router={router}/>
  </SmartBillProvider>
  </StrictMode>,
)
