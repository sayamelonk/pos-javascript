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
import UsersIndex from "../views/users";
import TransactionsIndex from "../views/transactions";
import Print from "../views/transactions/print/print";
import Sales from "../views/sales";
import Profits from "../views/profits";

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
      {/* {route "/users"} */}
      <Route
        path="/users"
        element={token ? <UsersIndex /> : <Navigate to="/" replace />}
      />
      {/* {route "/transactions"} */}
      <Route
        path="/transactions"
        element={token ? <TransactionsIndex /> : <Navigate to="/" replace />}
      />
      {/* {route "/transactions/print"} */}
      <Route
        path="/transactions/print"
        element={token ? <Print /> : <Navigate to="/" replace />}
      />
      {/* {route "/sales"} */}
      <Route
        path="/sales"
        element={token ? <Sales /> : <Navigate to="/" replace />}
      />
      {/* {route "/profits"} */}
      <Route
        path="/profits"
        element={token ? <Profits /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}
