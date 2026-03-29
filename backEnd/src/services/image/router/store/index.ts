import express, { Router } from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const router_store_image: Router = express.Router();

const imagePath = path.join(process.cwd(), 'data', 'image', 'output');
router_store_image.use('/', express.static(imagePath));

export default router_store_image;
