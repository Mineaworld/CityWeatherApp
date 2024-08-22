import React, { useEffect, useState } from "react";
import "./Weather.css";
import SerachIcon from "../assets/search.png";
import ClearIcon from "../assets/clear.png";
import CloudIcon from "../assets/cloud.png";
import WindIcon from "../assets/wind.png";
import DrizzleIcon from "../assets/drizzle.png";
import RainIcon from "../assets/rain.png";
import SnowIcon from "../assets/snow.png";
import HumidityIcon from "../assets/humidity.png";

const Weather = () => {
  // State variables for managing city input, loading state, weather data, and error messages
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch weather data from Weatherbit API
  const search = async (city) => {
    if (!city.trim()) {
      alert("Please enter a city name.");
      return;
    }

    setLoading(true); // Set loading state to true
    setError(null); // Clear any previous errors
    setWeatherData(null); // Clear previous weather data

    try {
      const url = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${
        import.meta.env.VITE_WEATHERBIT_API_KEY
      }`;
      const response = await fetch(url);

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Check if the API returned any data
      if (data.count === 0) {
        throw new Error("No data found for the specified city");
      }

      setWeatherData(data.data[0]); // Set weather data to state
    } catch (error) {
      setError(error.message); // Set error message to state
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // useEffect hook to search for the weather of "London" on component mount
  useEffect(() => {
    search("London");
  }, []);

  // Function to handle search button click
  const handleSearchClick = () => {
    search(city); // Trigger the search function with the current city input
  };

  // Event handler for Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      search(city);
    }
  };

  return (
    <div className="Weather">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress} // Listen for Enter key press
        />
        <img
          src={SerachIcon}
          alt="Search icon"
          onClick={handleSearchClick}
          style={{ cursor: city.trim() ? "pointer" : "not-allowed" }}
        />
      </div>
      {/* Conditional Rendering */}
      {loading && <p>Loading...</p>}{" "}
      {/* Show loading message if data is being fetched */}
      {error && <p>{error}</p>} {/* Show error message if an error occurred */}
      {weatherData /* Show weather data if available */ && (
        <>
          <img src={ClearIcon} alt="" className="weather-icons" />
          <p className="temperature">{weatherData.temp}°C</p>
          <p className="location">{weatherData.city_name}</p>
          <div className="weather-data">
            <div className="col">
              <img src={HumidityIcon} alt="Humidity icon" />
              <div>
                <p>{weatherData.rh} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={WindIcon} alt="Wind icon" />
              <div>
                <p>{weatherData.wind_spd} m/s</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
