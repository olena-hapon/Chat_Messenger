import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './homepage.css';
const Homepage = () => {
    const handleSignIn = () => {
        window.location.href = '/sign-in';
    };
    return (_jsxs("div", { className: 'homepage', children: [_jsxs("div", { className: "left", children: [_jsx("h1", { children: "Chat App" }), _jsx("h2", { children: "Start chatting" }), _jsx("h3", { children: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae deserunt, optio consequatur amet cupiditate hic, corrupti a nam quos dignissimos iusto. Nostrum eius ad nihil, vel suscipit nam doloribus earum?" }), _jsx("button", { onClick: handleSignIn, children: "Get Started" })] }), _jsx("div", { className: "right", children: _jsx("div", { className: "img_container", children: _jsx("img", { src: "/chat.jpg", alt: "" }) }) })] }));
};
export default Homepage;
