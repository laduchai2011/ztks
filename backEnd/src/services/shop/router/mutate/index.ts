import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Shop from './handle/Create_Shop';

dotenv.config();

const router_mutate_shop: Router = express.Router();

const handle_create_shop = new Handle_Create_Shop();

router_mutate_shop.post('/editPost', authentication, handle_create_shop.setup, handle_create_shop.main);

export default router_mutate_shop;
