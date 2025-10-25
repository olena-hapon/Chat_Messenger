// import { GoogleLogin } from "@react-oauth/google";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import "./signInPage2.css";

// const SignInPage2 = () => {
//   const navigate = useNavigate();

//   const handleLoginSuccess = (credentialResponse) => {
//     if (!credentialResponse.credential) return;

//     try {
//       const decoded = jwtDecode(credentialResponse.credential);

//       localStorage.setItem("googleToken", credentialResponse.credential);
//       localStorage.setItem("userEmail", decoded.email);
//       localStorage.setItem("userName", decoded.name);
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Error decoding token:", err);
//       alert("Failed to decode token");
//     }
//   };

//   return (
//     <div className="signin-page">
//       <div className="signin-card">
//         <h2 className="signin-title">Sign in to Chat App</h2>
//         <p className="signin-subtitle">Use your Google account to continue</p>
//         <GoogleLogin
//           onSuccess={handleLoginSuccess}
//           onError={() => alert("Login Failed")}
//         />
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

      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        alert("Token has expired. Please login again.");
        return;
      }

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
