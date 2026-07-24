import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';

dotenv.config();

const router_mutate_callAgent: Router = express.Router();

export default router_mutate_callAgent;
