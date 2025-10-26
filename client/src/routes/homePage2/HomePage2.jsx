import './homePage2.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage2 = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) setIsLoggedIn(true);
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/sign-in');
    }
  };

  return (
    <div className='homepage'>
      <div className="left">
        <h1>Chat Messenger</h1>
        <h2>Start chatting</h2>
        <h3>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
          deserunt, optio consequatur amet cupiditate hic, corrupti a nam quos
          dignissimos iusto. Nostrum eius ad nihil, vel suscipit nam doloribus
          earum?
        </h3>
        <button className="btn" onClick={handleClick}>
          {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
        </button>
      </div>
      <div className="right">
        <div className="img_container">
          <img src="/chat.jpg" alt="Chat illustration" />
        </div>
      </div>
    </div>
  );
};

export default HomePage2;
