import { useRecoilState } from "recoil";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Grid from "@mui/joy/Grid";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { _userIsLoggedIn, _favoritMovies } from "../services/atom";

function FaviritMovies() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useRecoilState(_userIsLoggedIn);
  const [favoriteMovies] = useRecoilState(_favoritMovies);
  const [favoritMovies, setFavoritMovie] = useState([]);
  const UserID = localStorage.getItem("userID");

  const imgPath = "https://image.tmdb.org/t/p/original/";

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
    fetchMovieData();
  }, []);

  return (
    <div>
      <p />
      <Grid
        container
        spacing={0}
        sx={{ flexGrow: 1, justifyContent: "center" }}
      >
        {favoritMovies.length == 0
          ? "There is no movies in the list"
          : favoritMovies.map((movie) => (
              <Card
                sx={{ minHeight: "280px", width: 180, m: 1 }}
                key={movie.id}
              >
                <CardCover>
                  <img
                    src={`${imgPath + movie.poster_path}`}
                    alt={movie.title}
                  />
                </CardCover>
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
                </CardContent>
              </Card>
            ))}
      </Grid>
    </div>
  );
}

export default FaviritMovies;
