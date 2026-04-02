import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetAllWallets from './handle/GetAllWallets';
import Handle_GetbalanceFluctuations from './handle/GetbalanceFluctuations';

dotenv.config();
const router_query_wallet: Router = express.Router();

const handle_getAllWallets = new Handle_GetAllWallets();
const handle_getbalanceFluctuations = new Handle_GetbalanceFluctuations();

router_query_wallet.post('/getAllWallets', authentication, handle_getAllWallets.setup, handle_getAllWallets.main);

router_query_wallet.post('/getbalanceFluctuations', authentication, handle_getbalanceFluctuations.main);

export default router_query_wallet;
