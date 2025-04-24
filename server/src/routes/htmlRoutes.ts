import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router, Request, Response } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
router.get('/', (req: Request, res: Response) => {
    const cityName = req.query.someParam;
    if (cityName) {
      console.log(`City name received: ${cityName}`);
      // Optionally, you could also store this information in a database or file
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

export default router;
