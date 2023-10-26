import * as React from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import { useState, useEffect, useRef } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Popup from "./Popup";
import IconButton from "@mui/joy/IconButton";

function SeriesSection({ seriesType, seriesData, imgPath }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSeriesId, setHoveredSeriesId] = useState(null);
  const scrollRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleScrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -window.innerWidth,
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    scrollRef.current.scrollBy({ left: window.innerWidth, behavior: "smooth" });
  };

  function capitalizeAndRemoveUnderscores(str) {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  return (
    <div key={seriesType}>
      <Typography level="body-lg" fontWeight="lg" textColor="#000">
        {capitalizeAndRemoveUnderscores(seriesType)}
      </Typography>
      <p />
      <Box
        sx={{
          position: "relative", // Added this line for the wrapper
        }}
      >
        <IconButton
          onClick={handleScrollLeft}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1000,
            color: "white",

            "&:hover": {
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.6)",
              height: "100%",
              width: "5%",
            },
          }}
        >
          <ArrowBackIosIcon
            sx={{ "&:hover": { width: "70%", height: "70%" } }}
          />
        </IconButton>

        <IconButton
          onClick={handleScrollRight}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1000,
            color: "white",

            "&:hover": {
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.6)",
              height: "100%",
              width: "5%",
            },
          }}
        >
          <ArrowForwardIosIcon
            sx={{ "&:hover": { width: "70%", height: "70%" } }}
          />
        </IconButton>

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            flexDirection: "row",
            overflowX: "hidden",
            overflowY: "hidden",
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
                  position: "relative",
                  overflow: "visible",
                }}
              >
                <Card
                  onMouseEnter={() => {
                    setHoveredSeriesId(series.id);
                    // Introducing delay before setting showPopup to true
                    timeoutRef.current = setTimeout(() => {
                      setShowPopup(true);
                    }, 500);
                  }}
                  onMouseLeave={() => {
                    setHoveredSeriesId(null);
                    setShowPopup(false);
                    clearTimeout(timeoutRef.current);
                  }}
                  sx={{
                    width: "250px",
                    height: "160px",
                    borderRadius: "4px",
                    position: "relative",
                    transition: "all 0.3s",
                    overflow: "visible",
                    "&:hover": {
                      position: "relative",
                      top: 0,
                      left: 0,
                      width: "340px",
                      height: "340px",
                      zIndex: 10,
                      transitionDelay: "0.5s",
                    },
                  }}
                >
                  {showPopup && hoveredSeriesId === series.id && (
                    <Popup series={series} />
                  )}
                  <CardCover
                    style={{
                      zIndex: 1,
                      transition: "all 0.3s",
                    }}
                  >
                    <img
                      src={`${imgPath + series.backdrop_path}`}
                      loading="lazy"
                    />
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
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          p: 1,
        }}
      ></Box>
    </div>
  );
}
export default function MediaCover() {
  const imgPath = "https://image.tmdb.org/t/p/original/";
  const [seriesData, setSeriesData] = useState({});
  const arrOfSeries = ["airing_today", "top_rated", "on_the_air", "popular"];

  function fetchData(seriesType) {
    fetch(`https://api.themoviedb.org/3/tv/${seriesType}?language=en-US&page=1`)
      .then((response) => response.json())
      .then((response) => {
        // Map over the results to pick only the fields you want
        const refinedData = response.results.map((item) => ({
          id: item.id,
          backdrop_path: item.backdrop_path,
          name: item.name,
          adult: item.adult,
          vote_average: item.vote_average,
        }));

        setSeriesData((prevData) => ({
          ...prevData,
          [seriesType]: refinedData,
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
