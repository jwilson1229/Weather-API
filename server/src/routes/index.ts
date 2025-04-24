import { Router } from 'express';
import weatherRoutes from './api/weatherRoutes.js';

console.log('Importing weatherRoutes from:', './api/weatherRoutes.js');

const router = Router();

router.use('/weather', weatherRoutes);

export default router;