import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './newPromt.css';

const NewPromt = ({ onSend, messages }) => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { id: chatId } = useParams();
  const endRef = useRef(null);

  const token = localStorage.getItem('googleToken');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isSending || !token) return;

    setIsSending(true);
    try {
      await fetch(`http://localhost:3000/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      setText('');
      onSend();

      setTimeout(() => {
        onSend();
      }, 4000);

    } catch (err) {
      console.log('Failed to send message', err);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      <div className="newPrompt">
        <form className="newForm" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSending}
          />
          <button type="submit" disabled={isSending || !text.trim()}>
            <img src="/arrow.png" alt="Send" />
          </button>
        </form>
      </div>

      <div className="endChat" ref={endRef}></div>
    </>
  );
};

export default NewPromt;
