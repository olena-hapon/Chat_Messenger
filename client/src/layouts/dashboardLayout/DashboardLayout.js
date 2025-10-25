import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useNavigate } from 'react-router-dom';
import './dashboardLauot.css';
import { useEffect } from 'react';
import Chatlist from '../../components/chatList/Chatlist';
const DashboardLayout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('userEmail')) {
            navigate('/sign-in');
        }
    }, [navigate]);
    return (_jsxs("div", { className: 'dashboardLayout', children: [_jsx("div", { className: 'menu', children: _jsx(Chatlist, {}) }), _jsx("div", { className: 'content', children: _jsx(Outlet, {}) })] }));
};
export default DashboardLayout;
