import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoSvg from '../assets/logo.svg';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg me-navbar py-2 px-3">
      <div className="container-fluid max-w-7xl">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand d-flex align-items-center gap-2">
          <img src={logoSvg} alt="MindEase Logo" width="34" height="34" />
          <span className="serif fs-4 fw-medium" style={{ color: 'var(--me-text)', letterSpacing: '-0.5px' }}>
            MindEase
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
                <li className="nav-item">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `nav-link px-3 py-1 rounded ${isActive ? 'fw-semibold text-dark' : 'text-muted'}`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/log"
                    className={({ isActive }) =>
                      `nav-link px-3 py-1 rounded ${isActive ? 'fw-semibold text-dark' : 'text-muted'}`
                    }
                  >
                    Log Mood
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/journey"
                    className={({ isActive }) =>
                      `nav-link px-3 py-1 rounded ${isActive ? 'fw-semibold text-dark' : 'text-muted'}`
                    }
                  >
                    My Journey
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/tools"
                    className={({ isActive }) =>
                      `nav-link px-3 py-1 rounded ${isActive ? 'fw-semibold text-dark' : 'text-muted'}`
                    }
                  >
                    Coping Tools
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/help"
                    className={({ isActive }) =>
                      `nav-link px-3 py-1 rounded ${isActive ? 'fw-semibold text-dark' : 'text-muted'}`
                    }
                  >
                    Get Help
                  </NavLink>
                </li>
              </ul>

              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/settings"
                  className="btn btn-sm btn-me-subtle d-flex align-items-center gap-1"
                  title="Settings & Privacy"
                >
                  <span>⚙️</span>
                  <span className="d-none d-sm-inline">{user?.name ? user.name.split(' ')[0] : 'Settings'}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="ms-auto d-flex align-items-center gap-2">
              <Link to="/help" className="btn btn-sm btn-link text-muted text-decoration-none">
                Helplines
              </Link>
              <Link to="/auth" className="btn btn-sm btn-me-primary">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
