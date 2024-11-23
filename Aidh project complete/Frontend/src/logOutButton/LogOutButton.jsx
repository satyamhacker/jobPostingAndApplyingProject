// LogoutButton.jsx
import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate(); // React Router's hook to programmatically navigate

  const handleLogout = () => {
    localStorage.removeItem("token"); // Delete token from localStorage
    alert("You have been logged out."); // Optional alert
    navigate("/"); // Redirect to the landing page
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleLogout}
      style={{ margin: "10px" }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
