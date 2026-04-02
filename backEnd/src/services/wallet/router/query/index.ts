import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetMyWalletWithType from './handle/GetMyWalletWithType';
import Handle_GetBalanceFluctuationsByDate from './handle/GetBalanceFluctuationsByDate';

dotenv.config();
const router_query_wallet: Router = express.Router();

const handle_getMyWalletWithType = new Handle_GetMyWalletWithType();
const handle_getBalanceFluctuationsByDate = new Handle_GetBalanceFluctuationsByDate();

router_query_wallet.post(
    '/getMyWalletWithType',
    authentication,
    handle_getMyWalletWithType.setup,
    handle_getMyWalletWithType.main
);

router_query_wallet.post('/getBalanceFluctuationsByDate', authentication, handle_getBalanceFluctuationsByDate.main);

export default router_query_wallet;
