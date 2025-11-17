import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css' 
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Layout from '../src/pages/Layout/Layout'; 
import Home from '../src/pages/Home/Home'
import Login from '../src/pages//Login/Login'
import ShopPage from '../src/pages/Shop/ShopPage'

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
        path: "/loja",
        element: <ShopPage />,
      },
      // {
      //   path: "/dashboard", 
      //   element: <Dashboard />,
      // },
    ]
  },
  {
    path: "/login",
    element: <Login />,
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