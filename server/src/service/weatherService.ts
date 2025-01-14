import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// Define a class for the Weather object
class Weather {
  constructor(
    public temperature: number,
    public description: string,
    public humidity: number,
    public windSpeed: number,
    public cityName: string
  ) {}
}

// Define the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = "https://api.openweathermap.org";
    this.apiKey = process.env.OPENWEATHER_API_KEY || "";
    this.cityName = ""; // Initialized when a city is queried
  }

  // Fetch location data from OpenWeatherMap
  private async fetchLocationData(query: string): Promise<any> {
    const url = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch location data");
    return response.json();
  }

  // Extract latitude and longitude from location data
  private destructureLocationData(locationData: any): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error("No location data found");
    }
    const { lat, lon } = locationData[0];
    return { latitude: lat, longitude: lon };
  }

  // Build the weather query URL
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=metric&appid=${this.apiKey}`;
  }

  // Fetch and parse current weather data
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch weather data");
    return response.json();
  }

  // Parse the current weather response into a Weather object
  private parseCurrentWeather(response: any): Weather {
    const { main, weather, wind, name } = response;
    return new Weather(
      main.temp,
      weather[0].description,
      main.humidity,
      wind.speed,
      name
    );
  }

  // Get weather for a city
  public async getWeatherForCity(city: string): Promise<Weather> {
    this.cityName = city;

    const locationData = await this.fetchLocationData(city);
    const coordinates = this.destructureLocationData(locationData);

    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();
