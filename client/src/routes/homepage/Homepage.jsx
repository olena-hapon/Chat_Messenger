import './homepage.css';
// @ts-ignore
import { Link } from 'react-router-dom';

const Homepage = () => {

  const handleSignIn = () => {
    window.location.href = '/sign-in';
  }

  return (
    <div className='homepage'>
      <div className="left">
        <h1>Chat App</h1>
        <h2>Start chatting</h2>
        <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae deserunt, optio consequatur amet cupiditate hic, corrupti a nam quos dignissimos iusto. Nostrum eius ad nihil, vel suscipit nam doloribus earum?</h3>
         <button onClick={handleSignIn}>Get Started</button>
         <div style={{ background: 'yellow', color: 'black' }}>Його не видно</div>
      </div>
      <div className="right">
        <div className="img_container">
          <img src="/chat.jpg" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Homepage
