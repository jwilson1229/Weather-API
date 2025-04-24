import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

console.log(`API_KEY from .env: ${process.env.API_KEY}`);  // Debugging the API Key

// Other code...


// Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// Define an interface for the Weather object
interface Weather {
  temperature: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

// Define an interface for the OpenWeatherMap API response
interface OpenWeatherMapResponse {
  name: string;
  weather: { icon: string; description: string }[];
  main: { temp: number; humidity: number };
  wind: { speed: number };
}

// Define an interface for the forecast data
interface ForecastItem {
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}

// Define the interface for the forecast response
interface ForecastResponse {
  list: Array<{
    dt: number;
    main: { temp: number; humidity: number };
    weather: Array<{ icon: string; description: string }>;
    wind: { speed: number };
    dt_txt: string;
  }>;
}

// Complete the WeatherService class
class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.API_KEY || '';
    console.log(`Using API Key: ${this.apiKey}`); // Debugging information
  }

  public async getWeather(cityName: string): Promise<Weather> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${this.apiKey}&units=imperial`
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching weather data: ${response.status} ${response.statusText} - ${errorText}`);
        throw new Error('Failed to fetch weather data');
      }
      const weatherData = await response.json() as OpenWeatherMapResponse;
      return {
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0].description,
        location: weatherData.name,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        icon: weatherData.weather[0].icon,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  public async getWeatherByCoordinates(coordinates: Coordinates): Promise<Weather> {
    try {
      const { latitude, longitude } = coordinates;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=imperial`
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching weather data: ${response.status} ${response.statusText} - ${errorText}`);
        throw new Error('Failed to fetch weather data');
      }
      const weatherData = await response.json() as OpenWeatherMapResponse;
      return {
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0].description,
        location: weatherData.name,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        icon: weatherData.weather[0].icon,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }
  
  // Get 5-day forecast data
  public async getForecast(cityName: string): Promise<ForecastItem[]> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this.apiKey}&units=imperial`
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching forecast data: ${response.status} ${response.statusText} - ${errorText}`);
        throw new Error('Failed to fetch forecast data');
      }
      const forecastData = await response.json() as ForecastResponse;
      
      // Get one forecast per day (every 24 hours) for 5 days
      const dailyForecasts: ForecastItem[] = [];
      const processedDates = new Set<string>();
      
      for (const item of forecastData.list) {
        // Extract the date part only (YYYY-MM-DD)
        const date = item.dt_txt.split(' ')[0];
        
        // Skip if we already have a forecast for this date
        if (processedDates.has(date)) {
          continue;
        }
        
        // Add this date to our processed set
        processedDates.add(date);
        
        // Format the date for display (MM/DD/YYYY)
        const [year, month, day] = date.split('-');
        const formattedDate = `${month}/${day}/${year}`;
        
        // Create a forecast item
        dailyForecasts.push({
          date: formattedDate,
          icon: item.weather[0].icon,
          iconDescription: item.weather[0].description,
          tempF: item.main.temp,
          windSpeed: item.wind.speed,
          humidity: item.main.humidity
        });
        
        // Stop once we have 5 days
        if (dailyForecasts.length >= 5) {
          break;
        }
      }
      
      return dailyForecasts;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  }
}

export default new WeatherService();