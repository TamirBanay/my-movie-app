import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { _movieIsOpen, _movieId, _userIsLoggedIn } from "../services/atom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userIsLoggedIn, setUserIsLoggedIn] = useRecoilState(_userIsLoggedIn);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const url = "http://localhost:8000/api/login/";
    const credentials = {
      username,
      password,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        // Handle non-2xx response (e.g., display error message)
        const errorData = await response.json();
        setError(errorData.non_field_errors || "Login failed");
      } else {
        const data = await response.json();
        localStorage.setItem("token", data.access); // Assuming the access token is what you want to store
        setUserIsLoggedIn(true);
        console.log(data.user.id); // Logs just the username
        // But data.user contains all the user info sent from the server
        navigate("/");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Login;
