import * as React from "react";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import {
  _moviesList,
  _currentPage,
  _movieIsOpen,
  _movieId,
} from "../services/atom";
import { useRecoilState } from "recoil";
import Grid from "@mui/joy/Grid";
import DotsMobileStepper from "./DotsMobileStepper";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";
export default function GradientCover() {
  const [movies, setMovies] = useRecoilState(_moviesList);
  const [movieIsOpen, setMovieIsOpen] = useRecoilState(_movieIsOpen);
  const [movieId, setMovieId] = useRecoilState(_movieId);

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
