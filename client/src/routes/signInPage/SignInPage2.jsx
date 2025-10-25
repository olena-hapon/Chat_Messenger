// import { GoogleLogin } from "@react-oauth/google";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { jwtDecode } from "jwt-decode";

// const SignInPage2 = () => {
//   const navigate = useNavigate();
//   const [credentialInfo, setCredentialInfo] = useState(null);

//   const handleLoginSuccess = async (credentialResponse) => {
//     console.log("Full credential response:", credentialResponse);
//     setCredentialInfo(credentialResponse);

//     if (!credentialResponse?.credential) return;

//     try {
//       const decoded = jwtDecode(credentialResponse.credential);
//       console.log("Decoded JWT:", decoded);

//       localStorage.setItem("googleToken", credentialResponse.credential);

//       if (decoded.email) localStorage.setItem("userEmail", decoded.email);
//       if (decoded.name) localStorage.setItem("userName", decoded.name);

//       const res = await fetch("http://localhost:3000/auth/google", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${credentialResponse.credential}`,
//         },
//         body: JSON.stringify({})
//       });

//       const data = await res.json();
//       console.log("User created or fetched:", data);

//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Failed to login:", err);
//       alert("Login failed");
//     }
//   };

//   const handleLoginError = () => {
//     console.error("Login Failed");
//     alert("Login Failed");
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Sign in to Chat App</h2>
//       <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />

//       <div style={{ marginTop: "2rem", background: "#f0f0f0", padding: "1rem" }}>
//         <h3>Credential Response (debug):</h3>
//         <pre>{credentialInfo ? JSON.stringify(credentialInfo, null, 2) : "Немає даних"}</pre>
//       </div>
//     </div>
//   );
// };

// export default SignInPage2;


import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./signInPage2.css";

const SignInPage2 = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    if (!credentialResponse.credential) return;

    try {
      const decoded = jwtDecode(credentialResponse.credential);

      localStorage.setItem("googleToken", credentialResponse.credential);
      localStorage.setItem("userEmail", decoded.email);
      localStorage.setItem("userName", decoded.name);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error decoding token:", err);
      alert("Failed to decode token");
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h2 className="signin-title">Sign in to Chat App</h2>
        <p className="signin-subtitle">Use your Google account to continue</p>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => alert("Login Failed")}
        />
      </div>
    </div>
  );
};

export default SignInPage2;


