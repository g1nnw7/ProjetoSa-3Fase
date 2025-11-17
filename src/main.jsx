import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css' 
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from '../src/contexts/AuthContext.jsx' 
import { CartProvider } from '../src/contexts/CartContext.jsx'
import Layout from './pages/Layout/Layout.jsx'; 
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import ShopPage from './pages/Shop/ShopPage.jsx'

const router = createBrowserRouter([
  {

    path: "/",
    element: <Layout />, 

    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/loja",
        element: <ShopPage />,
      },
      // {
      //   path: "/quiz",
      //   element: <Quiz />
      // },
      //
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <ToastContainer />
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)