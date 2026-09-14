import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetAllBanks from './handle/GetAllBanks';
import Handle_GetBankWithId from './handle/GetBankWithId';

dotenv.config();

const router_query_bank: Router = express.Router();
const handle_getAllBanks = new Handle_GetAllBanks();
const handle_getBankWithId = new Handle_GetBankWithId();

router_query_bank.post('/getAllBanks', authentication, handle_getAllBanks.setup, handle_getAllBanks.main);

router_query_bank.post('/getBankWithId', authentication, handle_getBankWithId.main);

export default router_query_bank;
