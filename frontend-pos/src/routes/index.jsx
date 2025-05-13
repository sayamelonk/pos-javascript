// import react router dom
import { Route, Routes, Navigate } from "react-router-dom";

// import store
import { useStore } from "../stores/user";

// import view login
import Login from "../views/auth/login";

// import view
import Dashboard from "../views/dashboard/index";
import CategoriesIndex from "../views/categories";
import ProductsIndex from "../views/products";
import CustomersIndex from "../views/customers";

export default function AppRoutes() {
  // destruct state "token" from store
  const { token } = useStore();

  return (
    <Routes>
      {/* {route "/"} */}
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      {/* route "/dashboard" */}
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/" replace />}
      />
      {/* route "/categories" */}
      <Route
        path="/categories"
        element={token ? <CategoriesIndex /> : <Navigate to="/" replace />}
      />
      {/* {route "/products"} */}
      <Route
        path="/products"
        element={token ? <ProductsIndex /> : <Navigate to="/" replace />}
      />
      {/* {route "/customers"} */}
      <Route
        path="/customers"
        element={token ? <CustomersIndex /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}
