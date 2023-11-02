import { useRecoilState } from "recoil";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Grid from "@mui/joy/Grid";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useHistory } from "react";

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
  _favoriteSeries,
  _favoriteSeriesDetails,
} from "../../services/atom";
import Favorite from "@mui/icons-material/Favorite";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";

function DisplayFavoriteSeries() {
  const [isDark, setIsDark] = useRecoilState(_isDark);
  const imgPath = "https://image.tmdb.org/t/p/original/";
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useRecoilState(_currentUserId);
  const UserID = localStorage.getItem("userID");
  const csrfToken = localStorage.getItem("token");

  const favoriteSeries = JSON.parse(
    localStorage.getItem("favoriteSeries") || "[]"
  );

  //   const [favoriteSeries, setFavoriteSeries] = useRecoilState(_favoriteSeries);
  const [favoritSeriesDetails, setFavoritSeriesDetails] = useRecoilState(
    _favoriteSeriesDetails
  );

  //   const fetchFavoriteSeries = (UserID) => {
  //     fetch(`http://localhost:8000/get_favorite_series/${UserID}/`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // console.log(data.series);
  //         setFavoriteSeries(data.series);
  //       })
  //       .catch((error) =>
  //         console.error("There was a problem with the fetch:", error)
  //       );
  //   };

  const fetchMovieData = async () => {
    if (!Array.isArray(favoriteSeries)) {
      console.error("favoriteSeries is not an array:", favoriteSeries);
      return;
    }
    const seriesData = await Promise.all(
      favoriteSeries.map((series) =>
        fetch(
          `https://api.themoviedb.org/3/tv/${series.tmdb_series_id}?api_key=633752bf172be33a57ace2501b29092a&language=en-US`
        ).then((response) => {
          if (!response.ok) {
            console.error(
              `Failed to fetch movie id ${series.tmdb_series_id}: ${response.statusText}`
            );
            return null; // or some other placeholder/error value
          }
          return response.json();
        })
      )
    );

    setFavoritSeriesDetails(seriesData);
  };
  console.log(favoritSeriesDetails);
  useEffect(() => {
    if (favoriteSeries.length > 0) {
      fetchMovieData();
      setCurrentUserId(UserID);
      localStorage.setItem("favoriteSeries", JSON.stringify(favoriteSeries));
    }
  }, []);

  return (
    <Grid
      container
      spacing={0}
      sx={{
        flexGrow: 1,
        justifyContent: "center",
      }}
    >
      {favoriteSeries.length == 0 ? (
        <div>
          <p />
          <Typography
            level="title-lg"
            textColor={isDark === "dark" ? "#fff" : "#000"}
          >
            There is no favorite series
          </Typography>
        </div>
      ) : (
        favoritSeriesDetails.map((series) => (
          <Card
            sx={{
              minHeight: "280px",
              width: 180,
              m: 1,
            }}
            key={series.id}
          >
            <CardCover>
              <img src={`${imgPath + series.poster_path}`} alt={series.title} />
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
                to={`/movie/${series.id}`}
                key={series.id}
              >
                <Typography level="title-lg" textColor="#fff">
                  {series.title}
                </Typography>
              </Link>
              <Typography
                startDecorator={
                  <Favorite
                    // onClick={() => removeFromFavorit(movie.id)}
                    color="warning"
                  />
                }
                textColor="neutral.300"
              >
                Remove from list
              </Typography>
            </CardContent>
            <IconButton
              sx={{
                bgcolor: "#D0E7D2",
              }}
              //   onClick={() => handleRoutToTrailer(series.id)} // Here is the attachment
            >
              <PlayArrowOutlinedIcon /> Watch Trailer
            </IconButton>
          </Card>
        ))
      )}
    </Grid>
  );
}

export default DisplayFavoriteSeries;
