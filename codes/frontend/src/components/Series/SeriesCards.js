import * as React from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import { useState, useEffect, useRef } from "react";
import Popup from "./Popup";
function SeriesSection({ seriesType, seriesData, imgPath }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSeriesId, setHoveredSeriesId] = useState(null);
  const scrollRef = useRef(null);

  const handleScrollLeft = () => {
    scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  function capitalizeAndRemoveUnderscores(str) {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div key={seriesType}>
      <Typography level="body-lg" fontWeight="lg" textColor="#000">
        {capitalizeAndRemoveUnderscores(seriesType)}
      </Typography>
      <p />
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          flexDirection: "row",
          overflowX: "hidden",
          overflowY: "hidden",
          "&:hover": {
            position: "relative",
          },
        }}
      >
        {Array.isArray(seriesData) &&
          seriesData.map((series) => (
            <Box
              key={series.id}
              sx={{
                display: "flex",
                flexDirection: "row",
                maxWidth: "400px",
                height: "auto",
                ml: "2px",
                position: "relative", // <-- Added this
                overflow: "visible",
              }}
            >
              <Card
                onMouseEnter={() => {
                  setHoveredSeriesId(series.id);
                }}
                onMouseLeave={() => setHoveredSeriesId(null)}
                sx={{
                  width: "250px",
                  height: "160px",
                  borderRadius: "4px",
                  position: "relative", // Default to relative
                  transition: "all 0.3s",
                  overflow: "visible",
                  // border: "solid 2px #202020",

                  "&:hover": {
                    position: "relative", // <-- Added this
                    top: 0,
                    left: 0,
                    width: "300px",
                    height: "300px",
                    zIndex: 10,
                  },
                }}
              >
                {hoveredSeriesId === series.id && <Popup series={series} />}
                <CardCover
                  style={{
                    zIndex: 1,
                    transition: "all 0.3s",
                  }}
                >
                  <img src={`${imgPath + series.poster_path}`} />
                </CardCover>
                <CardContent>
                  <Typography
                    level="body-lg"
                    fontWeight="lg"
                    textColor="#fff"
                    mt={{ xs: 12, sm: 18 }}
                  >
                    {series.name}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          p: 1,
        }}
      >
        <Button onClick={handleScrollLeft}>Left</Button>
        <Button onClick={handleScrollRight}>Right</Button>
      </Box>
      {/* {showPopup && selectedSeries && <Popup series={selectedSeries} />} */}
    </div>
  );
}

export default function MediaCover() {
  const imgPath = "https://image.tmdb.org/t/p/original/";
  const [seriesData, setSeriesData] = useState({});
  console.log(seriesData);
  const arrOfSeries = ["airing_today", "top_rated", "on_the_air", "popular"];

  function fetchData(seriesType) {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzM3NTJiZjE3MmJlMzNhNTdhY2UyNTAxYjI5MDkyYSIsInN1YiI6IjY1MDE5YWJjNmEyMjI3MDBhYmE5MWFlNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6EhZEXn1Bz9SFSO4_zALQKSY6DRvx_O7-tdzP1J_Ls0",
      },
    };

    fetch(
      `https://api.themoviedb.org/3/tv/${seriesType}?language=en-US&page=1`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setSeriesData((prevData) => ({
          ...prevData,
          [seriesType]: response.results,
        }));
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    arrOfSeries.forEach((seriesType) => {
      fetchData(seriesType);
    });
  }, []);

  return (
    <div>
      {arrOfSeries.map((seriesType) => (
        <SeriesSection
          key={seriesType}
          seriesType={seriesType}
          seriesData={seriesData[seriesType]}
          imgPath={imgPath}
        />
      ))}
    </div>
  );
}
