import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./Pages/HomePage.jsx";
import FundraisersPage from "./Pages/FundraisersPage.jsx";
import FundraiserPage from "./Pages/FundraiserPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";

const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/fundraiser/:id", element: <FundraiserPage /> },
      { path: "/fundraisers/:id", element: <FundraisersPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={myRouter} />
  </StrictMode>,
);
