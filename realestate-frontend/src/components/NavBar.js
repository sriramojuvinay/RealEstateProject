import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function NavBar() {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    alert("Logged out successfully");
    navigate("/login");
  };

 return (
  <nav className="navbar">
    <div className="navbar-logo">🏠 RealEstate</div>

    <div className="navbar-links">

      
      {isLoggedIn && role === "Admin" ? (
        <>
          <NavLink to="/admin">Dashboard</NavLink> 

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>

          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>

          <NavLink to="/properties" className="nav-link">
            Properties
          </NavLink>

          {isLoggedIn ? (
            <>
              
              <NavLink to="/mybookings" className="nav-link">
                My Bookings
              </NavLink>

              <NavLink to="/favorites" className="nav-link">
                Favorites ❤️
              </NavLink>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>

              <NavLink to="/register" className="nav-link register-link">
                Register
              </NavLink>
            </>
          )}
        </>
      )}
    </div>
  </nav>
);
}

export default NavBar;