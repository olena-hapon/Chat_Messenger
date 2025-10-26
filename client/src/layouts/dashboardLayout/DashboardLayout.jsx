import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ChatList from "../ChatList/Chatlist";
import LogoutBtn from "../../components/logoutBtn/LogoutBtn";

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
        localStorage.removeItem("googleToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        navigate("/sign-in");
        return;
      }

      setUser({ token, email, name });
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/sign-in");
    }
  }, [navigate]);

  if (!user) return <div>Redirecting to sign in...</div>;

  return (
    <div className="dashboardLayout">
      <LogoutBtn />
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

