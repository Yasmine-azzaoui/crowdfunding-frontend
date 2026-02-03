import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './assets/components/Layout'
import HomePage from './Pages/HomePage'
import FundraiserPage from './Pages/FundraiserPage'
import LoginPage from "./Pages/LoginPage.jsx";


const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
    {path: "/", element: <HomePage />},
    { path: "/login", element: <LoginPage /> },
    { path: "/fundraiser/:id", element: <FundraiserPage /> },
  ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router ={myRouter} />
  </StrictMode>,
)
