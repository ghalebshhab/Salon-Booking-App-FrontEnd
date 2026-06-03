import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAuthData, isLoggedIn } from "../../utils/tokenStorage";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const logout = () => {
    clearAuthData();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          SalonHub
        </Link>

        <nav className="nav-links">
          {/* Public Pages */}
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>

          <NavLink to="/hiring-posts" className="nav-link">
            Hiring Posts
          </NavLink>

          {/* Owner Pages */}
          {loggedIn && (
            <>
              <NavLink to="/owner/dashboard" className="nav-link">
                Dashboard
              </NavLink>

              <NavLink to="/owner/create-salon" className="nav-link">
                Create Salon
              </NavLink>

              <NavLink to="/owner/my-salon" className="nav-link">
                My Salon
              </NavLink>

              <NavLink to="/owner/create-hiring-post" className="nav-link">
                Create Hiring
              </NavLink>

              <NavLink to="/owner/create-media-post" className="nav-link">
                Post Media
              </NavLink>
            </>
          )}

          {/* Auth */}
          {loggedIn ? (
            <button className="btn btn-danger btn-small" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>

              <NavLink to="/register" className="btn btn-primary btn-small">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
