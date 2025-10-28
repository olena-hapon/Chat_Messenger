import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import './signInPage2.css';

const SignIn = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    if (!credentialResponse.credential) return;

    const decoded = jwtDecode(credentialResponse.credential);

    localStorage.setItem("googleToken", credentialResponse.credential);
    localStorage.setItem("userEmail", decoded.email);
    localStorage.setItem("userName", decoded.name);

    navigate("/dashboard");
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h2 className="signin-title">Sign in to Chat Messenger</h2>
        <p className="signin-subtitle">Use your Google account to continue</p>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      </div>
    </div>
  );
};

export default SignIn;
