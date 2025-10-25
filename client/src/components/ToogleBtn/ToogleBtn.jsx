import { useEffect, useState } from 'react';
import './toogleBtn.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket from '../../socket';

import { useParams } from 'react-router-dom';

const ToogleBTN = () => {
  const [autoSend, setAutoSend] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) setCurrentChatId(id);
  }, [id]);

  useEffect(() => {
    const handleNewMessage = (data) => {
      if (data.chatId !== currentChatId) {
        toast.info(`New reply in another chat: ${data.chatName}`);
      } else {
        toast.success(`Reply in this chat: ${data.message}`);
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [currentChatId]);

  useEffect(() => {
    let interval;
    if (autoSend) {
      interval = setInterval(() => {
        fetch('http://localhost:3000/api/auto-send', {
          method: 'POST',
        });
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [autoSend]);

  const sendOnceNow = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auto-send', {
        method: 'POST',
      });
      if (res.ok) toast.success('Message sent!');
      else toast.error('Failed to send message');
    } catch (err) {
      toast.error('Connection error');
    }
  };

  return (
    <div className="toogleWrap">
      <button className="toogleBtn" onClick={() => setAutoSend(!autoSend)}>
        {autoSend ? 'Disable Auto' : 'Enable Auto'}
      </button>

      <button className="toogleBtn" onClick={sendOnceNow}>
        Send Now
      </button>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ToogleBTN;
