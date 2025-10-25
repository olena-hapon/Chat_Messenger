import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
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
    } else {
      setUser({ token, email, name });
    }
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

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
