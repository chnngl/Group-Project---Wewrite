import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { Container, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/ApiRequest";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    createdAt: "",
  });
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to handle errors*/

  /**
   * Logs the user out of the application.
   * * On success, removes the token from localStorage, clears the Axios authorization header,
   * and navigates the user to the login page
   */
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`api/logout`);
      // Remove token from localStorage and clear axios defaults
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      navigate("/");
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data?.message || error.message
      );
      setError("Error logging out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
          setError("Token not found. Please log in again.");
          setLoading(false);
          return;
        }
        const response = await apiRequest(`getUser`);
        console.log.response;
        setUser(response.user);
      } catch (err) {
        console.error("Fetch Error:", err.message);
        setError("Failed to fetch the user");
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    fetchUser();
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #042414, #000001)",
        minHeight: "100vh",
      }}
    >
      {/* Back Arrow: Positioned at the top left */}
      <Link
        to="/Home"
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          color: "white",
          fontSize: "1.5rem",
          textDecoration: "none",
          zIndex: 1000,
        }}
      >
        <FaArrowLeft />
      </Link>

      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Card
          className="shadow p-4 w-100 m-4"
          style={{ borderRadius: "1rem", maxWidth: "800px" }}
        >
          {/* User Avatar Icon */}
          <div className="d-flex justify-content-center mb-3">
            <FaUserCircle style={{ fontSize: "7rem", color: "#ccc" }} />
          </div>
          {/* User Information */}
          <div className="text-center">
            <h3 className="mb-0 fw-bold">{user.name}</h3>
            <p className="text-muted mb-1">{user.email}</p>
            <p className="text-muted mb-3">
              Joined on {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* Divider */}
          <hr className="mx-auto w-50" />
          {/* Update Password Button */}
          <div className="text-center mt-3">
            <Link to="/updatepwd">
              <Button variant="success">Update Password</Button>
            </Link>
          </div>
          {/* Logout Button */}
          <div className="text-center mt-3">
            <Button variant="danger" onClick={logout}>
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default ProfilePage;
