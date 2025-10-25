import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import NewPromt from '../../components/newPromt/NewPromt';
import './chatPage2.css';

const fetchChatMessages = async (chatId, token) => {
  const response = await fetch(`http://localhost:3000/api/chats/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching chat');
  }

  return response.json();
};

const ChatPage2 = () => {
  const { id } = useParams();
  const token = localStorage.getItem('googleToken');
  const chatEndRef = useRef(null);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['chatMessages', id],
    queryFn: async () => {
      if (!id || !token) return;
      return fetchChatMessages(id, token);
    },
    enabled: !!id && !!token,
  });

  useEffect(() => {
    if (data && data.messages.length === 0) {
      const timer = setTimeout(() => {
        refetch();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [data, refetch]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No chat data found</div>;

  const { participant, messages } = data;

  return (
    <div className="chatPage">
      <div className="header">
        <div className="image">
          <img src="/user.png" alt="User" />
        </div>
        <div className="userInfo">
          <span className="firstName">{participant.firstName}</span>
          <span>{participant.lastName}</span>
        </div>
      </div>

      <div className="chatWrapper">
        <div className="chat">
          {messages.map((mes) => (
            <div
              key={mes._id}
              className={`message ${mes.sender === 'user' ? 'user' : ''}`}
            >
              {mes.text}
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>

        <NewPromt onSend={refetch} messages={messages} />
      </div>
    </div>
  );
};

export default ChatPage2;


