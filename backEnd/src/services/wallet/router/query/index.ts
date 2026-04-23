import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetMyWalletWithType from './handle/GetMyWalletWithType';
import Handle_GetBalanceFluctuationsByDate from './handle/GetBalanceFluctuationsByDate';
import Handle_GetBalanceFluctuationLatestDay from './handle/GetBalanceFluctuationLatestDay';
import Handle_MemberGetRequireTakeMoneyOfWallet from './handle/MemberGetRequireTakeMoneyOfWallet';
import Handle_MemberZtksGetRequiresTakeMoney from './handle/MemberZtksGetRequiresTakeMoney';

dotenv.config();
const router_query_wallet: Router = express.Router();

const handle_getMyWalletWithType = new Handle_GetMyWalletWithType();
const handle_getBalanceFluctuationsByDate = new Handle_GetBalanceFluctuationsByDate();
const handle_getBalanceFluctuationLatestDay = new Handle_GetBalanceFluctuationLatestDay();
const handle_memberGetRequireTakeMoneyOfWallet = new Handle_MemberGetRequireTakeMoneyOfWallet();
const handle_memberZtksGetRequiresTakeMoney = new Handle_MemberZtksGetRequiresTakeMoney();

router_query_wallet.post(
    '/getMyWalletWithType',
    authentication,
    handle_getMyWalletWithType.setup,
    handle_getMyWalletWithType.main
);

router_query_wallet.post('/getBalanceFluctuationsByDate', authentication, handle_getBalanceFluctuationsByDate.main);

router_query_wallet.post('/getBalanceFluctuationLatestDay', authentication, handle_getBalanceFluctuationLatestDay.main);

router_query_wallet.post(
    '/memberGetRequireTakeMoneyOfWallet',
    authentication,
    handle_memberGetRequireTakeMoneyOfWallet.main
);

router_query_wallet.post('/memberZtksGetRequiresTakeMoney', authentication, handle_memberZtksGetRequiresTakeMoney.main);

export default router_query_wallet;
