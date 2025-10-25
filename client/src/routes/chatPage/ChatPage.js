import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import NewPromt from '../../components/newPromt/NewPromt';
import './chatPage.css';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { useParams } from 'react-router-dom';
const fetchChatMessages = async (chatId, token) => {
    const response = await fetch(`https://chat-backend-jfbx.onrender.com/api/chats/${chatId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Error fetching chat');
    }
    return response.json();
};
const ChatPage = () => {
    const { id } = useParams();
    const { getToken } = useAuth();
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['chatMessages', id],
        queryFn: async () => {
            const token = await getToken();
            if (!id)
                return;
            if (!token)
                return;
            return fetchChatMessages(id, token);
        },
        enabled: !!id,
    });
    useEffect(() => {
        if (data && data.messages.length === 0) {
            const timer = setTimeout(() => {
                refetch();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [data, refetch]);
    if (isLoading) {
        return _jsx("div", { children: "Loading..." });
    }
    if (error) {
        return _jsxs("div", { children: ["Error: ", error.message] });
    }
    const { participant, messages } = data;
    return (_jsxs("div", { className: "chatPage", children: [_jsxs("div", { className: "header", children: [_jsx("div", { className: "image", children: _jsx("img", { src: "/user.png", alt: "" }) }), _jsxs("div", { className: "userInfo", children: [_jsx("span", { className: 'fistName', children: participant.firstName }), _jsx("span", { children: participant.lastName })] })] }), _jsx("div", { className: "wrapper", children: _jsxs("div", { className: "chat", children: [messages.map((mes) => (_jsx("div", { className: `message ${mes.sender === 'user' ? 'user' : ''}`, children: mes.text }, mes._id))), _jsx(NewPromt, { onSend: refetch, messages: messages })] }) })] }));
};
export default ChatPage;
