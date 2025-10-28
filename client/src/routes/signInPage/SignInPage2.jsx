// SignIn.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const SignIn = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse: any) => {
    if (!credentialResponse.credential) return;

    // Зберігаємо токен у localStorage
    localStorage.setItem("googleToken", credentialResponse.credential);

    // Переходимо на дашборд
    navigate("/dashboard");
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="signInPage">
      <h1>Sign in with Google</h1>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </div>
  );
};

export default SignIn;
