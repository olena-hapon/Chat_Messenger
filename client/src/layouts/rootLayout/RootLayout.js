import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// @ts-ignore
import { Link, Outlet } from 'react-router-dom';
import './rootLayout.css';
const API_URL = import.meta.env.VITE_API_UR;
const queryClient = new QueryClient();
const RootLayout = () => {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsxs("div", { className: "rootLayout", children: [_jsxs("header", { children: [_jsx(Link, { to: "/#", children: _jsx("span", { children: "Chat app" }) }), _jsx("div", { className: "user" })] }), _jsx("main", { children: _jsx(Outlet, {}) })] }) }));
};
export default RootLayout;
