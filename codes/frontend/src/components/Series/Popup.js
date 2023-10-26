import Typography from "@mui/joy/Typography";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/joy/IconButton";
import PlayCircleFilledOutlinedIcon from "@mui/icons-material/PlayCircleFilledOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RecommendOutlinedIcon from "@mui/icons-material/RecommendOutlined";
import StarPurple500SharpIcon from "@mui/icons-material/StarPurple500Sharp";
import { useState, useEffect, useRef } from "react";
const Popup = ({ series }) => {
  const [seriesDetails, setSeriesDetails] = useState([]);

  const imgPath = "https://image.tmdb.org/t/p/original/";

  const fetchSeriesDetails = () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzM3NTJiZjE3MmJlMzNhNTdhY2UyNTAxYjI5MDkyYSIsInN1YiI6IjY1MDE5YWJjNmEyMjI3MDBhYmE5MWFlNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6EhZEXn1Bz9SFSO4_zALQKSY6DRvx_O7-tdzP1J_Ls0",
      },
    };

    fetch(
      `https://api.themoviedb.org/3/tv/${series.id}?language=en-US`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        const extractedData = {
          backdrop_path: response.backdrop_path,
          name: response.name,
          adult: response.adult,
          vote_average: response.vote_average,
          number_of_seasons: response.number_of_seasons,
          number_of_episodes: response.number_of_episodes,
          genres: response.genres,
        };
        setSeriesDetails(extractedData);
      })
      .catch((err) => console.error(err));
  };
  console.log();
  useEffect(() => {
    fetchSeriesDetails();
  }, [series.id]);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        background: "#fff",
        zIndex: 2,
        width: "400px",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "auto",
      }}
      key={series.id}
    >
      <img
        loading="lazy"
        style={{
          height: "50%",
          width: "100%",
          objectFit: "cover",
          display: "block",
        }}
        src={`${imgPath + series.backdrop_path}`}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingTop: "10px",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "row", marginLeft: "10px" }}
        >
          <IconButton sx={{ width: "45px", height: "45px" }}>
            <AddCircleOutlineOutlinedIcon
              sx={{ width: "45px", height: "45px" }}
            />
          </IconButton>
          <IconButton sx={{ width: "45px", height: "45px" }}>
            <PlayCircleFilledOutlinedIcon
              sx={{ width: "45px", height: "45px" }}
            />
          </IconButton>
        </div>
        <div
          style={{ display: "flex", flexDirection: "row", marginRight: "10px" }}
        >
          <IconButton sx={{ width: "45px", height: "45px" }}>
            <ArrowDropDownCircleIcon sx={{ width: "45px", height: "45px" }} />
          </IconButton>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          level="body-lg"
          fontWeight="lg"
          textColor="#212121"
          sx={{ padding: "10px" }}
        >
          {series.name}{" "}
          {series.adult ? (
            <Typography fontSize="lg" fontWeight="sm">
              {" "}
              "18+"{" "}
            </Typography>
          ) : (
            <Typography fontSize="lg" fontWeight="sm">
              {" "}
              +13{" "}
            </Typography>
          )}
        </Typography>
        <div
          style={{ marginRight: "10px", display: "flex", flexDirection: "row" }}
        >
          <Typography level="body-lg" color="#000">
            {series.vote_average}
          </Typography>
          <StarPurple500SharpIcon sx={{ color: "#FFB000", mr: "1%" }} />
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Typography fontSize="lg" fontWeight="sm" sx={{ marginLeft: "10px" }}>
          {seriesDetails.number_of_seasons} Seasons{"   "}
          {seriesDetails.number_of_episodes} Episodes
        </Typography>
      </div>
      <div
        style={{
          width: "100%",

          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {seriesDetails &&
          seriesDetails.genres &&
          seriesDetails.genres.slice(0, 3).map((genre, index, array) => (
            <div key={genre.id} style={{ marginLeft: "10px" }}>
              <div>
                {genre.name}
                {index !== array.length - 1 && " |"}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Popup;
