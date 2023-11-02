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
import Popup from "./PopupSeriesCard";
import IconButton from "@mui/joy/IconButton";
import { createPortal } from "react-dom";
import { _favoriteSeries, _userIsLoggedIn } from "../../services/atom";
import { useRecoilState } from "recoil";

function SeriesSection({ seriesType, seriesData, imgPath }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSeriesId, setHoveredSeriesId] = useState(null);
  const [favoriteSeries, setFavoriteSeries] = useRecoilState(_favoriteSeries);
  const [userIsLoggedIn, setUserIsLoggedIn] = useRecoilState(_userIsLoggedIn);

  const scrollRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const timeoutRef = useRef(null);
  const cardRef = useRef(null); // <-- Add this ref
  const [popupPosition, setPopupPosition] = useState({ left: 0, top: 0 }); // <-- Add this state
  const UserID = localStorage.getItem("userID");

  // const fetchFavoriteSeries = (UserID) => {
  //   fetch(`http://localhost:8000/get_favorite_series/${UserID}/`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // console.log(data.series);
  //       setFavoriteSeries(data.series);
  //     })
  //     .catch((error) =>
  //       console.error("There was a problem with the fetch:", error)
  //     );
  // };
  // useEffect(() => {
  //   fetchFavoriteSeries(UserID);
  // }, []);

  const fetchFavoriteMovies = (UserID) => {
    fetch(`http://localhost:8000/get_favorite_series/${UserID}/`)
      .then((response) => response.json())
      .then((data) => {
        setFavoriteSeries(data.series);
      })
      .catch((error) =>
        console.error("There was a problem with the fetch:", error)
      );
  };
  useEffect(() => {
    fetchFavoriteMovies(UserID);
  }, []);
  const handleScrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -window.innerWidth,
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    scrollRef.current.scrollBy({ left: window.innerWidth, behavior: "smooth" });
  };
  const handleMouseEnter = (event, series) => {
    setHoveredSeriesId(series.id);
    setIsHovered(true); // Set hover state to true here

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setShowPopup(true);

      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = event.clientX;

        setPopupPosition({
          left: x,
          top: rect.top + window.scrollY + rect.height / 2,
        });
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false); // Set hover state to false here
    setShowPopup(false);
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
                ref={cardRef} // <-- Ensure this is present
                onMouseEnter={(e) => handleMouseEnter(e, series)}
                onMouseLeave={handleMouseLeave}
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  maxWidth: "400px",
                  height: "auto",
                  ml: "2px",
                }}
                key={series.id}
              >
                <Card
                  ref={cardRef} // <-- Attach the ref here
                  sx={{
                    width: "250px",
                    height: "160px",
                    borderRadius: "4px",
                    position: "relative",
                    transition: "all 0.3s",
                    overflow: "visible",
                    zIndex: 1, // Ensure Card is above other page elements
                    transform:
                      isHovered && hoveredSeriesId === series.id
                        ? "scale(1.05)"
                        : "scale(1)",
                  }}
                >
                  <CardCover
                    style={{
                      zIndex: 1,
                      transition: "all 0.3s",
                    }}
                  >
                    <img
                      src={`${imgPath + series.backdrop_path}`}
                      alt={series.name}
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
                <>
                  {showPopup &&
                    hoveredSeriesId === series.id &&
                    createPortal(
                      <Popup
                        series={series}
                        position={popupPosition}
                        // fetchFavoriteSeries={fetchFavoriteSeries(UserID)}
                      />, // <-- Pass the computed position
                      document.getElementById("popup-root")
                    )}
                </>
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

  // Important: Remember to replace 'YOUR_API_KEY_HERE' with your actual API key
  const API_KEY = "633752bf172be33a57ace2501b29092a";
  const arrOfSeries = ["airing_today", "top_rated", "on_the_air", "popular"];

  function fetchData(seriesType) {
    fetch(
      `https://api.themoviedb.org/3/tv/${seriesType}?language=en-US&page=1&api_key=${API_KEY}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API call failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        if (!response || !response.results) {
          console.error("Unexpected response format:", response);
          return;
        }

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
          seriesData={seriesData[seriesType] || []} // Provide an empty array if data is not fetched yet
          imgPath={imgPath}
        />
      ))}
    </div>
  );
}