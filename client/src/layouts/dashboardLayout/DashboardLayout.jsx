import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import jwtDecode from "jwt-decode";
import ChatList from "../ChatList/ChatList";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("googleToken");
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");

    if (!token || !email || !name) {
      navigate("/sign-in");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < currentTime) {
        handleLogout();
        return;
      }

      setUser({ token, email, name });
    } catch (error) {
      console.error("Invalid token:", error);
      handleLogout();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("googleToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setUser(null);
    navigate("/sign-in");
  };

  if (!user) return <div>Redirecting to sign in...</div>;

  return (
    <div className="dashboardLayout">
      <div className="logoutWrapper">
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="menu">
        <ChatList />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

