import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
// import Handle_CreateWallet from './handle/CreateWallet';
import Handle_PayAgentFromWallet from './handle/PayAgentFromWallet';
// import Handle_CreateOrderStatus from './handle/CreateOrderStatus';

dotenv.config();

const router_mutate_wallet: Router = express.Router();

// const handle_createWallet = new Handle_CreateWallet();
const handle_payAgentFromWallet = new Handle_PayAgentFromWallet();
// const handle_createOrderStatus = new Handle_CreateOrderStatus();

// router_mutate_wallet.post('/createWallet', authentication, handle_createWallet.setup, handle_createWallet.main);

router_mutate_wallet.post(
    '/payAgentFromWallet',
    authentication,
    handle_payAgentFromWallet.setup,
    handle_payAgentFromWallet.main
);

// router_mutate_order.post(
//     '/createOrderStatus',
//     authentication,
//     handle_createOrderStatus.setup,
//     handle_createOrderStatus.main
// );

export default router_mutate_wallet;
