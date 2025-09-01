import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../authContext";
import logo from "../assets/img/logo.png";
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg  border-bottom">
      <div className="container-fluid">
        
        <Link className="navbar-brand fw-semibold" to="/"><img src={logo} alt="illustration du logo du restaurant"></img></Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Liens */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!user && (
              <>
                <li className="nav-item">
                  <NavLink end to="/" className="nav-link">Accueil</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/carte" className="nav-link">Notre carte</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/reservation" className="nav-link">Réservation</NavLink>
                </li>
              </>
            )}

            {user?.role === "employe" && (
              <li className="nav-item">
                <NavLink to="/reservations" className="nav-link">Réservations</NavLink>
              </li>
            )}

            {user?.role === "admin" && (
              <>
                <li className="nav-item">
                  <NavLink to="/reservations" className="nav-link">Réservations</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/users" className="nav-link">Utilisateurs</NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex">
            {!user ? (
              <NavLink to="/login" className="btn">Connexion</NavLink>
            ) : (
              <button className="btn" onClick={logout}>
                Déconnexion 
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
