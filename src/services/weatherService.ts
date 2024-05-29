import axios from "axios";
import { WeatherResponse } from "../types/Weather";

const API_KEY = "f0b1e120fa3298bdbc21d35deca52750";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeather = async (city: string): Promise<WeatherResponse> => {
  try {
    const response = await axios.get<WeatherResponse>(
      `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data", error);
    throw error;
  }
};
