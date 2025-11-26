import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '../src/contexts/AuthContext.jsx'
import { CartProvider } from '../src/contexts/CartContext.jsx'
import Layout from '../src/pages/Layout/Layout.jsx';
import Home from '../src/pages/Home/Home.jsx'
import Login from '../src/pages/Login/Login.jsx'
import ShopPage from '../src/pages/Shop/ShopPage.jsx'
import DashboardPage from '../src/pages/Dashboard/DashboardPage.jsx'
import ProtectedRoute from '../src/utils/ProjectedRoutes.jsx'
import MyInfoPage from './pages/MyInfo/MyInfoPage.jsx'
import MacroCalculadora from './pages/Macro/MacroCaulculador.jsx'
import AdminRoute from './routes/adminRoute.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'

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
      {
        path: "calculadora",
        element: <MacroCalculadora />
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <DashboardPage />
          },
          {
            path: "info",
            element: <MyInfoPage />
          }
        ]
      },
      {
            path: "/admin",
            element: <AdminRoute />,
            children: [
              { path: "", element: <AdminDashboard /> } 
            ]
          }
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