import express, { Router } from 'express';
import dotenv from 'dotenv';
import path from "path";

dotenv.config();

const router_query_image: Router = express.Router();

const imagePath = path.join(process.cwd(), 'data', "image");
router_query_image.use("/image", express.static(imagePath));

export default router_query_image;
