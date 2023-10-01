import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import Typography from "@mui/joy/Typography";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Button from "@mui/joy/Button";
import Grid from "@mui/joy/Grid";
import { Link, useParams } from "react-router-dom";

import { _movieIsOpen, _movieId, _currentUserId } from "../services/atom";

export default function BasicCard() {
  const { id } = useParams();

  const [movieIsOpen, setMovieIsOpen] = useRecoilState(_movieIsOpen);
  const [movieId, setMovieId] = useRecoilState(_movieId);
  const [movie, setMovie] = useState({});
  const imgPath = "https://image.tmdb.org/t/p/original/";
  const [currentUserId, setCurrentUserId] = useRecoilState(_currentUserId);

  const handleOpenMovie = () => {
    setMovieIsOpen(!movieIsOpen);
  };

  const fetchMovieData = () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzM3NTJiZjE3MmJlMzNhNTdhY2UyNTAxYjI5MDkyYSIsInN1YiI6IjY1MDE5YWJjNmEyMjI3MDBhYmE5MWFlNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6EhZEXn1Bz9SFSO4_zALQKSY6DRvx_O7-tdzP1J_Ls0",
      },
    };

    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then((response) => response.json())
      .then((response) => setMovie(response))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMovieData();
  }, [id]);
  console.log(id);
  return (
    <div>
      <Grid
        container
        spacing={0}
        sx={{ flexGrow: 1, justifyContent: "center" }}
      >
        <Card sx={{ width: 620, height: "auto", m: "auto" }}>
          <div>
            <Typography level="title-lg">{movie.title}</Typography>
            <Typography level="body-sm">
              Release: {movie.release_date}
            </Typography>
          </div>
          <AspectRatio ratio={4 / 5}>
            {movie.poster_path && (
              <img src={`${imgPath + movie.poster_path}`} alt={movie.title} />
            )}
          </AspectRatio>
          <CardContent orientation="horizontal">
            <div>
              <Typography level="body-md">
                Rating: {movie.vote_average}
              </Typography>
              <Typography fontSize="lg" fontWeight="lg">
                Overview:{" "}
                <Typography fontSize="lg" fontWeight="sm">
                  {movie.overview}
                </Typography>
              </Typography>
            </div>
            <Link to={`/${currentUserId}`} style={{ marginTop: "auto" }}>
              <Button
                onClick={handleOpenMovie}
                variant="solid"
                size="lg"
                color="primary"
                aria-label="Explore Bahamas Islands"
                sx={{
                  // ml: "auto",
                  alignSelf: "center",
                  fontWeight: 600,
                  m: "auto",
                }}
              >
                Back
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Grid>
      <p />

      <p />
    </div>
  );
}
