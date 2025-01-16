import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { city } = req.body;

  if (!city || city.trim() === '') {
    return res.status(400).json({ error: 'Please enter a valid city' });
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(city);
    const savedEntry = await HistoryService.getCities(); 
    return res.status(200).json({ weatherData, savedEntry });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// GET search history
router.get('/history', async (req, res) => {
  try {
    const history = await HistoryService.getCities(); 
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const history = await HistoryService.getCities(); 
    const updatedHistory = history.filter(entry => entry.id !== id);

    if (history.length === updatedHistory.length) {
      return res.status(404).json({ error: 'City not found in history' });
    }

    await HistoryService.removeCity(id); 
    return res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default Router();
