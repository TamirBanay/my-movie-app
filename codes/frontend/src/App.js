import "./App.css";
import Home from "./pages/Home";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  HashRouter,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import {
  _moviesList,
  _currentPage,
  _movieId,
  _currentUserId,
  _userIsLoggedIn,
  _user,
} from "./services/atom";
import Navbar from "./components/Navbar";
import Movie from "./pages/Movie";
import Login from "./pages/Loginpage";
import SignUp from "./pages/SignUp";
import FaviritMovies from "./pages/FaviritMovies";

function App() {
  const [movies, setMovies] = useRecoilState(_moviesList);
  const [currentPage, setCurrentPage] = useRecoilState(_currentPage);
  const [movieId, setMovieId] = useRecoilState(_movieId);
  const [currentUserId, setCurrentUserId] = useRecoilState(_currentUserId);
  const [userIsLoggedIn, setUserIsLoggedIn] = useRecoilState(_userIsLoggedIn);
  let { userId } = useParams();
  const [user, setUser] = useRecoilState(_user);

  const fetchUserData = () => {
    if (currentUserId) {
      fetch(`http://localhost:8000/api/user/${userId}/`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          console.log(currentUserId);
          if (currentUserId == null) {
            setUserIsLoggedIn(false);
          } else {
            setUserIsLoggedIn(true);
          }
        })
        .catch((error) =>
          console.error("There was a problem with the fetch:", error)
        );
    }
  };
  const fetchMoviesData = () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzM3NTJiZjE3MmJlMzNhNTdhY2UyNTAxYjI5MDkyYSIsInN1YiI6IjY1MDE5YWJjNmEyMjI3MDBhYmE5MWFlNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6EhZEXn1Bz9SFSO4_zALQKSY6DRvx_O7-tdzP1J_Ls0",
      },
    };

    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${currentPage}`,
      options
    )
      .then((response) => response.json())
      .then((response) => setMovies(response.results))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMoviesData();
  }, [currentPage]);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  return (
    <div>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/:currentUserId" element={<Home />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/:currentUserId/favorits" element={<FaviritMovies />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
