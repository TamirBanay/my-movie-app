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
import { useRecoilState } from "recoil";
function Trailer() {
  const [videoKey, setVideoKey] = useState(null);
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});
  const [isDark, setIsDark] = useRecoilState(_isDark);

  let navigate = useNavigate();
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

        // Extract the YouTube video key from the API response
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
      <h1
        style={{
          textAlign: "center",
          color: isDark == "dark" ? "#D0E7D2" : "#191717",
        }}
      >
        {movie.title}
      </h1>
      <div style={centerContentStyle}>
        {videoKey ? (
          <iframe
            width="60%"
            height="615"
            src={`https://www.youtube.com/embed/${videoKey}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div style={{ textAlign: "center" }}>
        <Button
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
        </Button>
      </div>
    </div>
  );
}

export default Trailer;
