import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/joy/Button";
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
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import RatingStars from "../components/Movies&cards/RatingStars";

import Skeleton from "@mui/material/Skeleton";
import RecommendationsForYou from "../components/Trailers/RecommendationsForYou";
import { useRecoilState } from "recoil";
function Trailer(props) {
  const [videoKey, setVideoKey] = useState(null);
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});
  const [isDark, setIsDark] = useRecoilState(_isDark);
  const [showSkeleton, setShowSkeleton] = useState(true); // New state for Skeleton timeout
  let navigate = useNavigate();
  const imgPath = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    // Logic for hiding the skeleton after 2 seconds
    const skeletonTimer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);

    return () => clearTimeout(skeletonTimer);
  }, []);
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzM3NTJiZjE3MmJlMzNhNTdhY2UyNTAxYjI5MDkyYSIsInN1YiI6IjY1MDE5YWJjNmEyMjI3MDBhYmE5MWFlNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6EhZEXn1Bz9SFSO4_zALQKSY6DRvx_O7-tdzP1J_Ls0",
            },
          }
        );
        const data = await response.json();

        const youtubeVideo = data.results.find(
          (video) => video.site === "YouTube"
        );
        setVideoKey(youtubeVideo.key);
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    fetchTrailer();
  }, [movieId]);

  const fetchMovieData = () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzM3NTJiZjE3MmJlMzNhNTdhY2UyNTAxYjI5MDkyYSIsInN1YiI6IjY1MDE5YWJjNmEyMjI3MDBhYmE5MWFlNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6EhZEXn1Bz9SFSO4_zALQKSY6DRvx_O7-tdzP1J_Ls0",
      },
    };

    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      options
    )
      .then((response) => response.json())
      .then((response) => setMovie(response))
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    fetchMovieData();
  }, [movieId]);
  const centerContentStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            color: isDark == "dark" ? "#D0E7D2" : "#191717",
            display: "flex",
            justifyContent: "space-between", // This spreads out the child items
            alignItems: "center", // Vertically centers the child items
            width: "55%",
          }}
        >
          {movie.title}
          <RatingStars rating={movie.vote_average} />
        </h1>
      </div>

      {/* Flex container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Image */}
        <img
          src={`${imgPath + movie.poster_path}`}
          alt={movie.title}
          style={{
            width: "15%",
            objectFit: "cover",
            marginRight: "0.2%",
            height: "415px",
          }}
        />

        {/* Video */}
        {videoKey ? (
          <iframe
            width="40%" // Adjusted width to 65% to take into account the image and potential margins
            height="415"
            src={`https://www.youtube.com/embed/${videoKey}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          showSkeleton && (
            <Skeleton
              variant="rectangular"
              width="60%"
              height="615px"
              animation="wave"
            />
          )
        )}
      </div>
      <div style={{ textAlign: "center" }}>
        <p />
        {/* <Button
          onClick={() => navigate(-1)}
          variant="solid"
          size="lg"
          color="primary"
          aria-label="Explore Bahamas Islands"
          sx={{
            alignSelf: "center",
            fontWeight: 600,
          }}
        >
          Back
        </Button> */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            fontSize="lg"
            fontWeight="sm"
            sx={{
              display: "flex",
              width: "55%",
              textAlign: "left",
              color: isDark == "dark" ? "#D0E7D2" : "#191717",
            }}
          >
            {movie.overview}
          </Typography>
        </div>
        <p />
        <Divider orientation="horizontal" />
      </div>
      <RecommendationsForYou movieId={movieId} />
    </div>
  );
}

export default Trailer;
