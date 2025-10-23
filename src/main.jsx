import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import Home from './pages/Home/Home'
import Quiz from './pages/Quiz/Quiz'

// import App from './App.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/calculador",
    element: <Calculador />
  },
  {
    path: "/quiz",
    element: <Quiz />
  }    
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>,
)
