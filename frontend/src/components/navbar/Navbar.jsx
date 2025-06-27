import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import navbarBg from "/src/assets/nav_bg.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div
      className="fixed top-0 left-0 w-full z-50"
      style={{ fontFamily: "Montserrat" }}
    >
      {/* Main Navigation Bar */}
      <nav
        className="flex items-center justify-between px-4 py-2"
        style={{
          backgroundImage: `url(${navbarBg})`,
          backgroundSize: "cover",
        }}
      >
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link to="/Home">
            <img
              src="/src/assets/We-Write.png"
              alt="We Write Logo"
              className="h-15 object-contain"
            />
          </Link>
        </div>

        {/* Center: App Name */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="text-white text-xl font-bold">We - Write</span>
        </div>

        {/* Right: Desktop links and Mobile hamburger button */}
        <div className="flex items-center gap-4 relative">
          {/* Desktop links (shown on md and up) */}
          <div className="d-none d-md-flex align-items-center gap-3 font-bold">
            <Link
              to="/AboutUs"
              style={{
                textDecoration: "none",
                color: "white",
                fontSize: "1rem",
              }}
            >
              About Us
            </Link>
            &nbsp;
            <Link to="/Profile" style={{ textDecoration: "none", color: "white" }}>
              <FaUserCircle style={{ fontSize: "2.2rem" }} />
            </Link>
          </div>

          {/* Hamburger button (shown on small screens) */}
          <button
            onClick={toggleMenu}
            className="d-md-none"
            style={{ background: "none", border: "none", color: "white", fontSize: "1.25rem" }}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Mobile Dropdown: absolutely positioned under the hamburger button */}
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 0.5rem)",
                right: 0,
                background: "white",
                borderRadius: "0.25rem",
                boxShadow: "0 0.25rem 0.5rem rgba(0,0,0,0.15)",
                padding: "0.5rem 1rem",
                minWidth: "150px",
                zIndex: 100,
              }}
              className="d-md-none"
            >
              <div className="d-flex flex-column align-items-start">
                <Link
                  to="/AboutUs"
                  onClick={toggleMenu}
                  style={{
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    color: "black",
                    marginBottom: "0.5rem",
                  }}
                >
                  About Us
                </Link>
                <Link
                  to="/Profile"
                  onClick={toggleMenu}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Profile
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
