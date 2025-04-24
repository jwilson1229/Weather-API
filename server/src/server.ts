import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 💡 Explicitly load .env from the server root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import the routes
import weatherRoutes from './routes/api/weatherRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files of the entire client dist folder
const staticPath = path.join(__dirname, '../../client/dist');
console.log(`Serving static files from: ${staticPath}`);
app.use(express.static(staticPath));

// Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implement middleware to connect the routes
app.use('/api/weather', weatherRoutes);

// Catch-all route to return the index.html file
app.get('*', (req: Request, res: Response) => {
  console.log(`Received request for URL: ${req.url}`);
  const indexPath = path.resolve(__dirname, '../../client/dist/index.html');
  res.sendFile(indexPath);
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
