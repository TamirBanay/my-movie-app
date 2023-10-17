import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import {
  _userIsLoggedIn,
  _currentUserId,
  _user,
  _isDark,
} from "../services/atom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { IconButton } from "@mui/material";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright ©  "}
      <Link color="inherit">Tamir Banay</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const defaultTheme = createTheme();

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [succesSignUp, setSuccesSignUp] = useState(false);

  const [user, setUser] = useRecoilState(_user);
  const [isDark, setIsDark] = useRecoilState(_isDark);

  const [error, setError] = useState(null);
  const [userIsLoggedIn, setUserIsLoggedIn] = useRecoilState(_userIsLoggedIn);
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useRecoilState(_currentUserId);
  const [connectionDetails, setConnectionDetails] = useState([]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setConnectionDetails(codeResponse);
      getUserGoogleProfile(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });
  const getUserGoogleProfile = (codeResponse) => {
    const url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${codeResponse.access_token}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(async (data) => {
        setUser(data);

        const googleUserData = {
          first_name: data.given_name,
          last_name: data.family_name,
          username: data.email,
          email: data.email,
          password: 1234,
          isGoogleUser: true,
          googleID: data.id,
        };

        try {
          const response = await fetch("http://localhost:8000/api/signup/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(googleUserData),
          });

          if (!response.ok) {
            const errorData = await response.json();
          } else {
            const userData = await response.json();
            console.log("Signup successful", userData);
            setUser(userData);
            console.log(user);
            handleLoginGoogle(
              googleUserData.username,
              googleUserData.password,
              userData
            );
            return;
          }

          handleLoginGoogle(
            googleUserData.username,
            googleUserData.password,
            user
          );
          setUser(data);
        } catch (error) {
          console.error("Network error", error);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    if (!succesSignUp) {
    } else {
    }
  };

  useEffect(() => {
    setUserIsLoggedIn(false);
    setIsDark("light");
  }, [userIsLoggedIn, isDark]);

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
        localStorage.setItem("isLoggedIn", true);
        setUserIsLoggedIn(true);
        setCurrentUserId(data.user.id);
        setUser(data);
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

  const handleLoginGoogle = async (username, password, user) => {
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
        const user = await response.json();
        localStorage.setItem("token", user.access);
        localStorage.setItem("userID", user.user.id);
        localStorage.setItem("isLoggedIn", true);
        setUserIsLoggedIn(true);
        setCurrentUserId(user.user.id);
        setUser(user);

        if (user.user.id) {
          navigate(`/${user.user.id}`);
        } else {
          console.error("User ID is null or undefined:", user);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleLogin}
              >
                Sign In
              </Button>
              <IconButton sx={{ borderRadius: 0 }} onClick={() => login()}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                <Typography variant="subtitle1" color="#000">
                  {" "}
                  Sign in with Google
                </Typography>
              </IconButton>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/#/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
            {/* <button onClick={() => login()}>Sign in with Google 🚀 </button> */}
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Login;
