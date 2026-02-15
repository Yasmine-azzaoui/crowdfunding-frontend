import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./Pages/HomePage.jsx";
import FundraisersPage from "./Pages/FundraisersPage.jsx";
import FundraiserPage from "./Pages/FundraiserPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import AccountPage from "./Pages/AccountPage.jsx";
import CreateFundraiser from "./Pages/CreateFundraiser.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import "./modern.css";
import "./index.css";

const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/account", element: <AccountPage /> },
      { path: "/create-fundraiser", element: <CreateFundraiser /> },
      { path: "/fundraiser/:id", element: <FundraiserPage /> },
      { path: "/fundraisers", element: <FundraisersPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={myRouter} />
  </StrictMode>,
);
