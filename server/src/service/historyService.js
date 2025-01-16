import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
// Define the path to the search history file
const searchHistoryPath = path.join(__dirname, 'searchHistory.json');
// Define a City class with name and id properties
class City {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
// Complete the HistoryService class
class HistoryService {
    // Define a read method that reads from the searchHistory.json file
    async read() {
        try {
            const data = await fs.readFile(searchHistoryPath, 'utf8');
            return JSON.parse(data);
        }
        catch (error) {
            console.log("Error reading file", error);
            return [];
        }
    }
    // Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        try {
            await fs.writeFile(searchHistoryPath, JSON.stringify(cities, null, 2), 'utf8');
        }
        catch (error) {
            console.log("Error writing file", error);
        }
    }
    // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        return await this.read();
    }
    // Define an addCity method that adds a city to the searchHistory.json file
    async addCity(cityName) {
        const cities = await this.read();
        const newCity = new City(uuidv4(), cityName);
        cities.push(newCity);
        await this.write(cities);
        return newCity;
    }
    // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        const cities = await this.read();
        const updatedCities = cities.filter((city) => city.id !== id);
        if (cities.length === updatedCities.length) {
            console.log(`City with id ${id} was not found.`);
            return false;
        }
        await this.write(updatedCities);
        console.log(`City with id ${id} has been removed.`);
        return true;
    }
}
export default new HistoryService();
