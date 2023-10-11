import { useRecoilState } from "recoil";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Grid from "@mui/joy/Grid";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  _moviesList,
  _currentPage,
  _movieIsOpen,
  _movieId,
  _currentUserId,
  _user,
  _userIsLoggedIn,
  _favoritMovies,
  _isLiked,
  _favoritMoviesDetails,
  _isDark,
} from "../services/atom";
import Favorite from "@mui/icons-material/Favorite";

function FavoritMovies() {
  const [currentUserId, setCurrentUserId] = useRecoilState(_currentUserId);
  const [favoriteMovies, setFavoriteMovies] = useRecoilState(_favoritMovies);
  const [isDark, setIsDark] = useRecoilState(_isDark);

  const [favoritMovies, setFavoritMovie] = useRecoilState(
    _favoritMoviesDetails
  );
  const theme = localStorage.getItem("theme");
  const UserID = localStorage.getItem("userID");
  const csrfToken = localStorage.getItem("token");
  const userIsLoggedIn = localStorage.getItem("isLoggedIn");
  const imgPath = "https://image.tmdb.org/t/p/original/";
  console.log(favoriteMovies.length);
  const fetchMovieData = async () => {
    const moviesData = await Promise.all(
      favoriteMovies.map((movie) =>
        fetch(
          `https://api.themoviedb.org/3/movie/${movie.tmdb_movie_id}?api_key=633752bf172be33a57ace2501b29092a&language=en-US`
        ).then((response) => {
          if (!response.ok) {
            console.error(
              `Failed to fetch movie id ${movie.tmdb_movie_id}: ${response.statusText}`
            );
            return null; // or some other placeholder/error value
          }
          return response.json();
        })
      )
    );

    setFavoritMovie(moviesData);
  };

  useEffect(() => {
    if (favoriteMovies.length > 0) {
      fetchMovieData();
      localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
    } else {
      localStorage.removeItem("favoriteMovies");
    }
  }, [favoriteMovies]);
  const initializeFavoritesFromLocalStorage = () => {
    const storedFavoriteMovies = localStorage.getItem("favoriteMovies");
    if (storedFavoriteMovies) {
      setFavoriteMovies(JSON.parse(storedFavoriteMovies));
    }
  };
  useEffect(() => {
    initializeFavoritesFromLocalStorage();
  }, []);

  const removeFromFavorit = (movieId) => {
    const url = `http://localhost:8000/remove_favorite/${movieId}/${UserID}/`;
    fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Movie removed successfully");
          setFavoriteMovies((prevState) =>
            prevState.filter((movie) => movie.tmdb_movie_id !== movieId)
          );
        } else {
          console.error("Failed to remove movie");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
      }}
    >
      <p />
      <Grid
        container
        spacing={0}
        sx={{
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        {favoriteMovies.length == 0 ? (
          <div>
            <p />
            <Typography
              level="title-lg"
              textColor={isDark === "dark" ? "#fff" : "#000"}
            >
              There is no favorite movies
            </Typography>
          </div>
        ) : (
          favoritMovies.map((movie) => (
            <Card
              sx={{
                minHeight: "280px",
                width: 180,
                m: 1,
              }}
              key={movie.id}
            >
              <CardCover>
                <img src={`${imgPath + movie.poster_path}`} alt={movie.title} />
              </CardCover>
              <CardCover
                sx={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                }}
              />
              <CardContent sx={{ justifyContent: "flex-end" }}>
                <Link
                  style={{ color: "#000", textDecoration: "none" }}
                  to={`/movie/${movie.id}`}
                  key={movie.id}
                >
                  <Typography level="title-lg" textColor="#fff">
                    {movie.title}
                  </Typography>
                </Link>
                <Typography
                  startDecorator={
                    <Favorite
                      onClick={() => removeFromFavorit(movie.id)}
                      color="warning"
                      // onClick={() => handleIsLiked(movie.id, movie.title)}
                    />
                  }
                  textColor="neutral.300"
                >
                  Remove from list
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Grid>
    </div>
  );
}

export default FavoritMovies;
