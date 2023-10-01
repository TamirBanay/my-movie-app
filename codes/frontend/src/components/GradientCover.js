import * as React from "react";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Favorite from "@mui/icons-material/Favorite";
import IconButton from "@mui/joy/IconButton";

import { useEffect, useState } from "react";
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
} from "../services/atom";
import { useRecoilState } from "recoil";
import Grid from "@mui/joy/Grid";
import DotsMobileStepper from "./DotsMobileStepper";
import MovieCard from "./MovieCard";
import { Link, useParams } from "react-router-dom";

export default function GradientCover(props) {
  const [movies, setMovies] = useRecoilState(_moviesList);
  const [movieIsOpen, setMovieIsOpen] = useRecoilState(_movieIsOpen);
  const [movieId, setMovieId] = useRecoilState(_movieId);
  const [currentUserId, setCurrentUserId] = useRecoilState(_currentUserId);
  const [user, setUser] = useRecoilState(_user);
  let { userId } = useParams();
  const [favoriteMovies, setFavoriteMovies] = useRecoilState(_favoritMovies);

  const [userIsLoggedIn, setUserIsLoggedIn] = useRecoilState(_userIsLoggedIn);
  const [isLiked, setIsLiked] = useRecoilState(_isLiked); // Changed to an object
  const UserID = localStorage.getItem("userID");
  const csrfToken = localStorage.getItem("token");

  const handleIsLiked = (movieId) => {
    const newIsLiked = !isLiked[movieId];
    setIsLiked((prevState) => ({
      ...prevState,
      [movieId]: newIsLiked,
    }));

    if (newIsLiked) {
      fetch("http://localhost:8000/add_favorite/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          tmdb_movie_id: movieId,
          user: currentUserId, // Use the state variable
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(JSON.stringify(response));
          setFavoriteMovies((prevState) => [
            ...prevState,
            { tmdb_movie_id: movieId }, // Assuming the data structure is like this
          ]);
        });
    } else {
      const url = `http://localhost:8000/remove_favorite/${movieId}/${currentUserId}/`;
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
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/user/${UserID}/`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setCurrentUserId(UserID);
        setUserIsLoggedIn(true);
      })
      .catch((error) =>
        console.error("There was a problem with the fetch:", error)
      );
  }, []);

  const handleOpenMovie = (movieID) => {
    setMovieIsOpen(!movieIsOpen);
    setMovieId(movieID);
  };

  const fetchFavoriteMovies = (UserID) => {
    fetch(`http://localhost:8000/favorite_movies/${UserID}/`)
      .then((response) => response.json())
      .then((data) => {
        setFavoriteMovies(data.movies);
      })
      .catch((error) =>
        console.error("There was a problem with the fetch:", error)
      );
  };

  useEffect(() => {
    fetchFavoriteMovies(UserID);
  }, []);

  const imgPath = "https://image.tmdb.org/t/p/original/";
  return (
    <div>
      {" "}
      <Grid
        container
        spacing={0}
        sx={{ flexGrow: 1, justifyContent: "center" }}
      >
        {movies.map((movie) => (
          <Card
            sx={{ minHeight: "280px", width: 180, m: 1 }}
            key={movie.id}
            onClick={() => handleOpenMovie(movie.id)}
          >
            <CardCover>
              <img src={`${imgPath + movie.poster_path}`} />
            </CardCover>

            <CardCover
              sx={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
              }}
            />

            <CardContent sx={{ justifyContent: "flex-end" }}>
              <Link
                style={{ color: "#000", textDecoration: "none" }} // added textDecoration to remove link underline
                to={`/movie/${movie.id}`} // Fixed the route path to include movie ID
                key={movie.id}
              >
                <Typography level="title-lg" textColor="#fff">
                  {movie.title}
                </Typography>
              </Link>

              <Typography
                startDecorator={
                  <Favorite
                    onClick={() => handleIsLiked(movie.id, movie.title)}
                    color={
                      favoriteMovies.some(
                        (favoriteMovie) =>
                          favoriteMovie.tmdb_movie_id === movie.id
                      )
                        ? "warning"
                        : ""
                    }
                  />
                }
                textColor="neutral.300"
              >
                {favoriteMovies.some(
                  (favoriteMovie) => favoriteMovie.tmdb_movie_id === movie.id
                )
                  ? "Remove from list"
                  : "Add from favorites"}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
      <p />
      {movieIsOpen ? "" : <DotsMobileStepper />}
    </div>
  );
}
