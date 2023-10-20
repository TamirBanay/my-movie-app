import * as React from "react";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Favorite from "@mui/icons-material/Favorite";
import IconButton from "@mui/joy/IconButton";
import { CardMedia } from "@mui/material";
import SelectCategory from "./SelectCategory";
import { useEffect, useState } from "react";
import RatingStars from "./RatingStars";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import { useNavigate } from "react-router-dom";

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
  _isDark,
} from "../services/atom";
import { useRecoilState } from "recoil";
import Grid from "@mui/joy/Grid";
import DotsMobileStepper from "./DotsMobileStepper";
import MovieCard from "./MovieCard";
import { Link, useParams } from "react-router-dom";
import AlertNotifications from "./AlertNotifications";
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
  const [filterLetter, setFilterLetter] = useState("");
  const [isDark, setIsDark] = useRecoilState(_isDark);
  const navigate = useNavigate();

  const [showAlertSuccessAddMovie, setShowAlertSuccessAddMovie] =
    useState(false);
  const [showAlertDeleteMovie, setShowAlertDeleteMovie] = useState(false);
  const [inputStyle, setInputStyle] = useState({
    borderRadius: "15px",
    height: "20px",
    // marginLeft: "10%",
    padding: "10px",
    border: "2px solid #4a90e2",
    outline: "none",
    fontSize: "16px",
    color: "#333",
    maxWidth: "400px",
    width: "100%",
  });
  useEffect(() => {
    const updateStyle = () => {
      if (window.innerWidth >= 768) {
        setInputStyle((prevStyle) => ({
          ...prevStyle,

          backgroundColor: isDark === "dark" ? "#212121" : "#fff",
          color: isDark === "dark" ? "#fff" : "",
        }));
      } else {
        setInputStyle((prevStyle) => ({
          ...prevStyle,
          width: "100%",
          // marginLeft: "10%",
          backgroundColor: isDark == "dark" ? "#212121" : "#fff",
          color: isDark === "dark" ? "#fff" : "",
        }));
      }
    };

    window.addEventListener("resize", updateStyle);
    updateStyle();

    return () => window.removeEventListener("resize", updateStyle);
  }, [isDark]);

  const handleIsLiked = (movieId) => {
    if (userIsLoggedIn) {
      const isAlreadyFavorite = favoriteMovies.some(
        (favoriteMovie) => favoriteMovie.tmdb_movie_id === movieId
      );

      const newIsLiked = !isLiked[movieId];
      setIsLiked((prevState) => ({
        ...prevState,
        [movieId]: newIsLiked,
      }));

      if (newIsLiked) {
        if (isAlreadyFavorite) {
          return;
        }
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
            setShowAlertSuccessAddMovie(true);
            setTimeout(() => {
              setShowAlertSuccessAddMovie(false);
            }, 3000);
            setFavoriteMovies((prevState) => [
              ...prevState,
              { tmdb_movie_id: movieId }, // Assuming the data structure is like this
            ]);
          });
      } else {
        if (!isAlreadyFavorite) {
          console.log("Movie is not in favorites to remove");
          return;
        }
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
              setShowAlertDeleteMovie(true);
              setTimeout(() => {
                setShowAlertDeleteMovie(false);
              }, 3000);

              setFavoriteMovies((prevState) =>
                prevState.filter((movie) => movie.tmdb_movie_id !== movieId)
              );
            } else {
              console.error("Failed to remove movie");
            }
          })
          .catch((error) => console.error("Error:", error));
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (userIsLoggedIn) {
      fetch(`http://localhost:8000/api/user_detail/${UserID}/`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          setCurrentUserId(UserID);
          setUserIsLoggedIn(true);
        })
        .catch((error) =>
          console.error("There was a problem with the fetch:", error)
        );
    }
  }, []);

  const handleOpenMovie = (movieID) => {
    setMovieIsOpen(!movieIsOpen);
    setMovieId(movieID);
  };
  const handleRoutToTrailer = (movieID) => {
    navigate(`/${currentUserId}/trailer/${movieID}`);
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
    if (userIsLoggedIn) fetchFavoriteMovies(UserID);
  }, []);

  const imgPath = "https://image.tmdb.org/t/p/original/";

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(filterLetter.toLowerCase())
  );

  return (
    <div>
      <p />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={0.2}
      >
        <Grid>
          <SelectCategory />
        </Grid>

        <Grid>
          <input
            style={inputStyle}
            type="text"
            placeholder=" Search Movie"
            value={filterLetter}
            onChange={(e) => setFilterLetter(e.target.value)}
          />
        </Grid>
      </Grid>
      <p />
      <Grid
        container
        spacing={0}
        sx={{ flexGrow: 1, justifyContent: "center" }}
      >
        {filteredMovies.map((movie) => (
          <Card sx={{ minHeight: "280px", width: 180, m: 1 }} key={movie.id}>
            <CardCover>
              <img src={`${imgPath + movie.poster_path}`} />
            </CardCover>
            <RatingStars rating={movie.vote_average} />

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
                <Typography
                  level="title-lg"
                  textColor="#fff"
                  onClick={() => handleOpenMovie(movie.id)}
                >
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
            <IconButton
              sx={{
                bgcolor: "#D0E7D2",
              }}
              onClick={() => handleRoutToTrailer(movie.id)} // Here is the attachment
            >
              <PlayArrowOutlinedIcon /> Watch Trailer
            </IconButton>
          </Card>
        ))}
      </Grid>
      <p />
      {showAlertSuccessAddMovie && (
        <AlertNotifications text={"Movie add to list Successfully"} />
      )}
      {showAlertDeleteMovie && (
        <AlertNotifications text={"Movie deleted from the list Successfully"} />
      )}

      {movieIsOpen ? "" : <DotsMobileStepper />}
    </div>
  );
}
