import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Hospital, Menu, X } from "lucide-react";
import { LoginContext } from "../../Context/LoginContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { user, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dashboardPath =
    user?.role === "ROLE_Admin"
      ? "/admin-dashboard"
      : user?.role === "ROLE_Doctor"
        ? "/doctor-dashboard"
        : "/patient-dashboard";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`;

  const mobileLinkClass = ({ isActive }) =>
    `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`;

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>
            <Hospital size={18} />
          </span>
          <span className={styles.brandName}>CARE<span className={styles.brandNameAccent}>POINT</span></span>
        </Link>

        <nav className={styles.navLinks} aria-label="Primary navigation">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <a href="/#specialties" className={styles.navLink}>
            Specialties
          </a>
          <a href="/#process" className={styles.navLink}>
            How it works
          </a>
        </nav>

        <div className={styles.actions}>
          {user ? (
            <>
              <Link
                to={dashboardPath}
                className={`${styles.button} ${styles.primary}`}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={`${styles.button} ${styles.secondary}`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${styles.button} ${styles.secondary}`}
              >
                Login
              </Link>
              <Link
                to="/registration"
                className={`${styles.button} ${styles.primary}`}
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className={styles.mobilePanel} id="mobile-navigation">
          <nav className={styles.mobileLinks} aria-label="Mobile navigation">
          <NavLink to="/" className={mobileLinkClass} end onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <a href="/#specialties" className={styles.mobileLink} onClick={() => setOpen(false)}>
            Specialties
          </a>
          <a href="/#process" className={styles.mobileLink} onClick={() => setOpen(false)}>
            How it works
          </a>
          </nav>
          <div className={styles.mobileActions}>
          {user ? (
            <>
              <Link to={dashboardPath} className={`${styles.mobileButton} ${styles.primary}`} onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <button type="button" onClick={handleLogout} className={`${styles.mobileButton} ${styles.secondary} ${styles.logout}`}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`${styles.mobileButton} ${styles.secondary}`} onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/registration" className={`${styles.mobileButton} ${styles.primary}`} onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
