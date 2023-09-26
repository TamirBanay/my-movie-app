import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import { _userIsLoggedIn, _currentUserId } from "../services/atom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userIsLoggedIn, setUserIsLoggedIn] = useRecoilState(_userIsLoggedIn);
  const navigate = useNavigate();
  let { userId } = useParams();
  const [currentUserId, setCurrentUserId] = useRecoilState(_currentUserId);

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
        const errorData = await response.json();
        setError(errorData.non_field_errors || "Login failed");
      } else {
        const data = await response.json();
        localStorage.setItem("token", data.access);
        localStorage.setItem("userID", data.user.id);
        setUserIsLoggedIn(true);
        setCurrentUserId(data.user.id);
        if (data.user.id) {
          navigate(`/${data.user.id}`);
        } else {
          console.error("User ID is null or undefined:", data);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div>
      <p />
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
