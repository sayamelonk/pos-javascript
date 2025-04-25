
// import store theme
import { useStore as useThemeStore } from "../stores/theme";

// import store user
import { useStore as useUserStore } from "../stores/user";

// import link and useLocation
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function header() {
  // destruct state "theme" and action "changeTheme" from store
  const { theme, changeTheme } = useThemeStore();

  // destruct state "user" from store
  const { user, logout } = useUserStore();

  // location from react router dom
  const location = useLocation();

  // navigate
  const navigate = useNavigate();

  // function logout
  const logoutHandler = () => {
    // call action "logout" from store
    logout();
    // redirect to login
    navigate("/login");
  };

  return (
    <div className="sticky-top">
      <header className="navbar navbar-expand-md d-print-none sticky-top">
        <div className="container-xl">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-menu"
            aria-controls="navbar-menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3 mt-1">
            <Link to={"/"}>
              <img
                src="/images/logo.png"
                alt="Tabler"
                height={"32"}
                width={"100"}
                className="navbar-brand-image mb-2"
              />
              <label className="ms-2">POINT OF SALE</label>
            </Link>
          </h1>
          <div className="navbar-nav flex-row order-md-last">
            <div className="d-none d-md-flex me-2">
              {theme === "dark" ? (
                // if the theme is dark, render the link to switch to light mode and hide the dark mode toggle
                <button
                  onClick={changeTheme}
                  className="nav-link px-0"
                  title="Enable light mode"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                    height={"24"}
                    width={"24"}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    />
                  </svg>
                </button>
              ) : (
                // If the theme is light, render the link to switch to dark mode and hide the light mode toggle
                <button
                  onClick={changeTheme}
                  className="nav-link px-0"
                  title="Enable dark mode"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                    height={"24"}
                    width={"24"}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link d-flex lh-1 text-reset p-0"
                data-bs-toggle="dropdown"
                aria-label="Open user menu"
              >
                <span
                  className="avatar avatar-sm"
                  style={{ backgroundImage: "url(/images/boy.png)" }}
                />
                <div className="d-none d-xl-block ps-2">
                  <div>{user?.name}</div>
                  <div className="mt-1 small text-muted">{user?.email}</div>
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow rounded mt-3">
                <Link to={`/users/${user?.id}`} className="dropdown-item">
                  Profile
                </Link>
                <div className="dropdown-divider"></div>
                <a href="#" onClick={logoutHandler} className="dropdown-item">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar bg-muted-lt">
            <div className="container-xl">
              <ul className="navbar-nav">
                <li
                  className={`nav-item ${
                    location.pathname === "/dashboard" ? "active" : ""
                  }`}
                >
                  <Link className="nav-link" to={"/dashboard"}>
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                        width={"24"}
                        height={"24"}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                      </svg>
                    </span>
                    <span className="nav-link-title">HOME</span>
                  </Link>
                </li>
                <li
                  className={`nav-item dropdown ${
                    location.pathname === "/categories" ||
                    location.pathname === "/products"
                      ? "active"
                      : ""
                  }`}
                >
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    role="button"
                    aria-expanded="false"
                  >
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                        height={"24"}
                        width={"24"}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
                    </span>
                    <span className="nav-link-title">MASTER</span>
                  </a>
                  <div className="dropdown-menu">
                    <Link className="dropdown-item" to={"/categories"}>
                      Categories
                    </Link>
                    <Link className="dropdown-item" to={"/products"}>
                      Products
                    </Link>
                  </div>
                </li>
                <li
                  className={`nav-item ${
                    location.pathname === "/customers" ? "active" : ""
                  }`}
                >
                  <Link className="nav-link" to={"/customers"}>
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                        width={"24"}
                        height={"24"}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                      </svg>
                    </span>
                    <span className="nav-link-title">CUSTOMERS</span>
                  </Link>
                </li>
                <li
                  className={`nav-item ${
                    location.pathname === "/transactions" ? "active" : ""
                  }`}
                >
                  <Link className="nav-link" to={"/transactions"}>
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                        width={"24"}
                        height={"24"}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                      </svg>
                    </span>
                    <span className="nav-link-title">TRANSACTIONS</span>
                  </Link>
                </li>
                <li
                  className={`nav-item dropdown ${
                    location.pathname === "/sales" ||
                    location.pathname == "/profits"
                      ? "active"
                      : ""
                  }`}
                >
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    role="button"
                    aria-expanded="false"
                  >
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                        width={"24"}
                        height={"24"}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                        />
                      </svg>
                    </span>
                    <span className="nav-link-tittle">REPORT</span>
                  </a>
                  <div className="dropdown-menu">
                    <Link className="dropdown-item" to={"/sales"}>
                      Sales
                    </Link>
                    <Link className="dropdown-item" to={"/profits"}>
                      Profits
                    </Link>
                  </div>
                </li>
                <li
                  className={`nav-item ${
                    location.pathname === "/users" ? "active" : ""
                  }`}
                >
                  <Link className="nav-link" to={"/users"}>
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                        width={"24"}
                        height={"24"}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    </span>
                    <span className="nav-link-title">USERS</span>
                  </Link>
                </li>
              </ul>
              <div className="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
                <form action="./" method="get" autoComplete="off" noValidate>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                        width={"24"}
                        height={"24"}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      aria-label="Search in website"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
