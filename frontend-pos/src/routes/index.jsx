// import react router dom
import { Route, Routes, Navigate } from "react-router-dom";

// import store
import { useStore } from "../stores/user";

// import view login
import Login from "../views/auth/login";

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
    </Routes>
  );
}
