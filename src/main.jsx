import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import Home from './pages/Home/Home'
import Quiz from './pages/Quiz/Quiz'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login/Login'
import { AuthProvider } from './contexts/AuthContext'

// NOSSOS NOVOS IMPORTS
import { CartProvider } from './contexts/CartContext.jsx' // <--- NOVO
import ShopPage from './pages/Shop/ShopPage.jsx'           // <--- NOVO

// import App from './App.jsx'

const router = createBrowserRouter([
 {
  path: "/",
  element: <Home />
 },
 {
  path: "/login",
  element: <Login />
 },
 {
  path: "/loja", // <--- NOVA ROTA DA LOJA
  element: <ShopPage />
 },
 // {
 //  path: "/calculador",
 //  element: <Calculador />
 // },
 // {
 //  path: "/quiz",
 //  element: <Quiz />
 // }   
])

createRoot(document.getElementById('root')).render(
 <StrictMode>
  <AuthProvider>
    {/* O CartProvider envolve o Router, dando acesso ao carrinho em todas as páginas */}
    <CartProvider>
      <ToastContainer />
      <RouterProvider router={router} />
      {/* <App /> */}
    </CartProvider>
  </AuthProvider>
 </StrictMode>,
)