import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {}
}

// Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.filePath = path.join(__dirname, '../db/searchHistory.json');
  }

  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // If the file does not exist, return an empty array
        return [];
      } else {
        throw error;
      }
    }
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const data = JSON.stringify(cities, null, 2);
    await fs.writeFile(this.filePath, data, 'utf-8');
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  public async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  public async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(cityName, uuidv4());
    cities.push(newCity);
    await this.write(cities);
  }

  // Define a removeCity method that removes a city from the searchHistory.json file
  public async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();