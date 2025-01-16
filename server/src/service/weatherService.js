import dotenv from 'dotenv';
dotenv.config();
// Define a class for the Weather object
class Weather {
    constructor(temperature, description, humidity, windSpeed, cityName) {
        this.temperature = temperature;
        this.description = description;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.cityName = cityName;
    }
}
// Define the WeatherService class
class WeatherService {
    constructor() {
        this.baseURL = "https://api.openweathermap.org";
        this.apiKey = process.env.OPENWEATHER_API_KEY || "";
        this.cityName = ""; // Initialized when a city is queried
    }
    // Fetch location data from OpenWeatherMap
    async fetchLocationData(query) {
        const url = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok)
            throw new Error("Failed to fetch location data");
        return response.json();
    }
    // Extract latitude and longitude from location data
    destructureLocationData(locationData) {
        if (!locationData || locationData.length === 0) {
            throw new Error("No location data found");
        }
        const { lat, lon } = locationData[0];
        return { latitude: lat, longitude: lon };
    }
    // Build the weather query URL
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=metric&appid=${this.apiKey}`;
    }
    // Fetch and parse current weather data
    async fetchWeatherData(coordinates) {
        const url = this.buildWeatherQuery(coordinates);
        const response = await fetch(url);
        if (!response.ok)
            throw new Error("Failed to fetch weather data");
        return response.json();
    }
    // Parse the current weather response into a Weather object
    parseCurrentWeather(response) {
        const { main, weather, wind, name } = response;
        return new Weather(main.temp, weather[0].description, main.humidity, wind.speed, name);
    }
    // Get weather for a city
    async getWeatherForCity(city) {
        this.cityName = city;
        const locationData = await this.fetchLocationData(city);
        const coordinates = this.destructureLocationData(locationData);
        const weatherData = await this.fetchWeatherData(coordinates);
        return this.parseCurrentWeather(weatherData);
    }
}
export default new WeatherService();
