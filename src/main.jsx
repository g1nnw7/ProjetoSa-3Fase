import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css' 
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import Layout from './pages/Layout/Layout.jsx'; 
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import ShopPage from './pages/Shop/ShopPage.jsx'
import MacroCalculadora from './pages/Macro/MacroCaulculador.jsx'
import DashboardPage from './pages/Dashboard/DashboardPage.jsx' 
import MyInfoPage from './pages/MyInfo/MyInfoPage.jsx'
import AddressesPage from './pages/Dashboard/AdressPage.jsx' 
import CheckoutPage from './pages/Checkout/CheckoutPage.jsx' 
import ProtectedRoute from './routes/adminRoute.jsx'  
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import AdminRoute from './routes/adminRoute.jsx'
import OrdersPage from './pages/Orders/OrdersPage.jsx'
import Quiz from './pages/Quiz/Quiz.jsx'
import Plano from './pages/Plano/Plano.jsx'
import Myplan from './pages/MyPlan/MyPlan.jsx'
import DevReceita from './pages/DevReceita/DevReceita.jsx'

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
        path: "loja", 
        element: <ShopPage />,
      },
      {
        path: "calculadora", 
        element: <MacroCalculadora />,
      },
       {
        path: "quiz", 
        element: <Quiz />,
      },
      {
        path: "devreceitas", 
        element: <DevReceita />,
      },
       {
        path: "plano", 
        element: <Plano />,
      },
      
      {
        element: <ProtectedRoute />,
        children: [

          {
             path: "dashboard",
             children: [
                { path: "", element: <DashboardPage /> }, 
                { path: "info", element: <MyInfoPage /> }, 
                { path: "addresses", element: <AddressesPage /> },
                { path: "orders", element: <OrdersPage /> },
                 { path: "myplan", element: <Myplan /> }
             ]
          },
          {
            path: "checkout",
            element: <CheckoutPage /> 
          }
        ]
      }, 
      {
        path: "admin", 
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