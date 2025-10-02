import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Header() {
  const logoSrc = `${process.env.PUBLIC_URL}/assets/images/logo.png`;
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setShowDropdown(false); // close dropdown on logout
    navigate("/");
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div>
      <header className="header">
        {/* Top Bar */}
        <div className="top_bar">
          <div className="container">
            <div className="row">
              <div className="col d-flex flex-row">
                <div className="phone">+45 345 3324 56789</div>
                <div className="social">
                  <ul className="social_list">
                    <li className="social_list_item"><a href="#"><i className="fa fa-pinterest" /></a></li>
                    <li className="social_list_item"><a href="#"><i className="fa fa-facebook" /></a></li>
                    <li className="social_list_item"><a href="#"><i className="fa fa-twitter" /></a></li>
                    <li className="social_list_item"><a href="#"><i className="fa fa-dribbble" /></a></li>
                    <li className="social_list_item"><a href="#"><i className="fa fa-behance" /></a></li>
                    <li className="social_list_item"><a href="#"><i className="fa fa-linkedin" /></a></li>
                  </ul>
                </div>

                {/* User section */}
                <div className="user_box ml-auto d-flex align-items-center">
                  {!user ? (
                    <>
                      <div className="user_box_login user_box_link">
                        <Link to="/login">Login</Link>
                      </div>
                      <div className="user_box_register user_box_link">
                        <Link to="/register">Register</Link>
                      </div>
                    </>
                  ) : (
                    <div className="dropdown" ref={dropdownRef}>
                      <div
                        className="d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowDropdown((prev) => !prev)}
                      >
                        <div
                          style={{
                            width: 35,
                            height: 35,
                            borderRadius: "50%",
                            background: "#6c63ff",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            marginRight: "8px",
                          }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                        <i className="fa fa-caret-down ms-2"></i>
                      </div>

                      {showDropdown && (
                        <ul
                          className="dropdown-menu show"
                          style={{
                            display: "block",
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            zIndex: 1000,
                            minWidth: "160px",
                            padding: "0.5rem 0",
                            margin: "0",
                            fontSize: "1rem",
                            backgroundColor: "#fff",
                            border: "1px solid rgba(0,0,0,.15)",
                            borderRadius: "0.25rem",
                          }}
                        >
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/myposts"
                              onClick={() => setShowDropdown(false)}
                            >
                              <i className="fa fa-list me-2"></i> My Posts
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/settings"
                              onClick={() => setShowDropdown(false)}
                            >
                              <i className="fa fa-cog me-2"></i> Settings
                            </Link>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={handleLogout}
                            >
                              <i className="fa fa-sign-out me-2"></i> Logout
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="main_nav">
          <div className="container">
            <div className="row">
              <div className="col main_nav_col d-flex flex-row align-items-center justify-content-start">
                <div className="logo_container">
                  <div className="logo">
                    <Link to="/">
                      <img src={logoSrc} alt="NovaScotiaAle" />
                    </Link>
                  </div>
                </div>

                <div className="main_nav_container ml-auto">
                  <ul className="main_nav_list">
                    <li className="main_nav_item"><NavLink to="/" end>home</NavLink></li>
                    <li className="main_nav_item"><NavLink to="/about">about us</NavLink></li>
                    <li className="main_nav_item"><NavLink to="/offers">Offers</NavLink></li>
                    <li className="main_nav_item"><NavLink to="/blog">News</NavLink></li>
                    <li className="main_nav_item"><NavLink to="/contact">Contact</NavLink></li>
                  </ul>
                </div>

                <div className="content_search ml-lg-0 ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 512 512">
                    <g><g><g>
                      <path className="mag_glass" fill="#FFFFFF" d="M78.438,216.78c0,57.906,22.55,112.343,63.493,153.287c40.945,40.944,95.383,63.494,153.287,63.494
                      s112.344-22.55,153.287-63.494C489.451,329.123,512,274.686,512,216.78c0-57.904-22.549-112.342-63.494-153.286
                      C407.563,22.549,353.124,0,295.219,0c-57.904,0-112.342,22.549-153.287,63.494C100.988,104.438,78.439,158.876,78.438,216.78z"/>
                    </g></g></g>
                  </svg>
                </div>

                <form id="search_form" className="search_form bez_1" onSubmit={(e)=>e.preventDefault()}>
                  <input type="search" className="search_content_input bez_1" />
                </form>

                <div className="hamburger">
                  <i className="fa fa-bars trans_200" />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header;
