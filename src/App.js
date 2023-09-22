import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { _moviesList, _currentPage, _movieId } from "./services/atom";
import Navbar from "./components/Navbar";
import Movie from "./pages/Movie";
function App() {
  const [movies, setMovies] = useRecoilState(_moviesList);
  const [currentPage, setCurrentPage] = useRecoilState(_currentPage);
  const [movieId, setMovieId] = useRecoilState(_movieId);

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
  console.log(movies);
  return (
    <div>
      <Navbar />
      <p />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Movie />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
