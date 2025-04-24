import { Router, Request, Response } from 'express';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';

const router = Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const cityName: string = req.body.city;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }
  try {
    const weatherData = await WeatherService.getWeather(cityName);
    const forecastData = await WeatherService.getForecast(cityName);
    await HistoryService.addCity(cityName);
    
    // Transform the data to match what the frontend expects
    const formattedData = {
      current: {
        city: weatherData.location,
        date: new Date().toLocaleDateString(),
        icon: weatherData.icon,
        iconDescription: weatherData.condition,
        tempF: weatherData.temperature,
        windSpeed: weatherData.windSpeed,
        humidity: weatherData.humidity
      },
      forecast: forecastData
    };
    
    return res.json(formattedData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET Request to retrieve search history
router.get('/history', async (req: Request, res: Response) => {
  console.log(`Received GET request for URL: ${req.url}`); // Use req parameter
  try {
    const history = await HistoryService.getCities();
    return res.json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// DELETE Request to remove a city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const cityId: string = req.params.id;
  if (!cityId) {
    return res.status(400).json({ error: 'City ID is required' });
  }
  try {
    await HistoryService.removeCity(cityId);
    return res.send(`Deleted city with id ${cityId}`);
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    return res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;