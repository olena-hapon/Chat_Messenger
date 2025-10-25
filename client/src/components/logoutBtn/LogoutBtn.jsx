import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { useEffect, useState } from "react";
import "./logoutBtn.css";

const LogoutBtn = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("googleToken");
    const email = localStorage.getItem("userEmail");
    setIsLoggedIn(!!(token || email));
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("googleToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    navigate("/sign-in");
  };

  if (!isLoggedIn) return null;

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutBtn;
