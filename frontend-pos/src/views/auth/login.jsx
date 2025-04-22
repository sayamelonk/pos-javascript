// import layout auth
import LayoutAuth from "../../layouts/auth";

// import hook react
import { useState } from "react";

// import hook useNavigate from react router dom
import { useNavigate } from "react-router-dom";

// import store
import { useStore } from "../../stores/user";

// import handler error
import { handlerErrors } from "../../utils/handlerErrors";

export default function Login() {
  // navigate
  const navigate = useNavigate();

  // destruct state "token" from store
  const { login } = useStore();

  // define state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // define state errors
  const [errors, setErrors] = useState({});
  const [loginFailed, setLoginFailed] = useState("");

  // function "loginHandler"
  const loginHandler = async (e) => {
    e.preventDefault();

    // call action "login" from store
    await login({ email, password })
      .then(() => {
        // redirect to dashboard
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error.response.data.message) {
          setLoginFailed(error.response.data.message);
          return;
        }

        // assign error to function "handleErrors"
        handlerErrors(error.response.data, setErrors);
      });
  };

  return (
    <LayoutAuth>
      <div className="text-center mb-4 mt-5">
        <a
          href="/"
          className="navbar-brand navbar-brand-autodork p-4 bg-blue-lt rounded-circle shadow-sm"
        >
          <img src="/images/logo.png" height={"60"} alt="" />
        </a>
        <br />
        <h2 className="mt-3">POINT OF SALE</h2>
      </div>
      <div className="card card-md rounded">
        <div className="card-body">
          <h2 className="h2 text-center mb-4">Login to your account</h2>
          {loginFailed && (
            <div className="alert alert-danger mt-2">{loginFailed}</div>
          )}
          <form onSubmit={loginHandler} autoComplete="off" noValidate>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                autoComplete="off"
              />
              {errors.email && (
                <div className="alert alert-danger mt-2">{errors.email}</div>
              )}
            </div>
            <div className="mb-2">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="off"
              />
              {errors.password && (
                <div className="alert alert-danger mt-2">{errors.password}</div>
              )}
            </div>
            <div className="mb-2">
              <label className="form-check">
                <input type="checkbox" className="form-check-input" />
                <span className="form-check-label">
                  Remember me on this device
                </span>
              </label>
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-primary w-100 rounded">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAuth>
  );
}
