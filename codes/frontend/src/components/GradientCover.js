import * as React from "react";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { useEffect, useState } from "react";
import {
  _moviesList,
  _currentPage,
  _movieIsOpen,
  _movieId,
  _currentUserId,
  _user,
  _userIsLoggedIn,
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
  const [userIsLoggedIn, setUserIsLoggedIn] = useRecoilState(_userIsLoggedIn);

  // const fetchUserDataBasedOnToken = (token) => {
  //   fetch(`http://localhost:8000/api/user/`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setUser(data);
  //       setCurrentUserId(data.id);
  //     })
  //     .catch((error) =>
  //       console.error("There was a problem with the fetch:", error)
  //     );
  // };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     fetchUserDataBasedOnToken(token);
  //   }
  // }, []);

  const UserID = localStorage.getItem("userID");
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
          <Link
            style={{ color: "#000" }}
            to={`/movie/${movie.id}`} // Fixed the route path to include movie ID
            key={movie.id}
          >
            <Card
              sx={{ minHeight: "280px", width: 120, m: 1 }}
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
                <Typography level="title-lg" textColor="#fff">
                  {movie.title}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Grid>
      <p />
      {movieIsOpen ? "" : <DotsMobileStepper />}
    </div>
  );
}
