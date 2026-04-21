import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_PayAgentFromWallet from './handle/PayAgentFromWallet';
import Handle_CreateRequireTakeMoney from './handle/CreateRequireTakeMoney';
import Handle_EditRequireTakeMoney from './handle/EditRequireTakeMoney';

dotenv.config();

const router_mutate_wallet: Router = express.Router();

const handle_payAgentFromWallet = new Handle_PayAgentFromWallet();
const handle_createRequireTakeMoney = new Handle_CreateRequireTakeMoney();
const handle_editRequireTakeMoney = new Handle_EditRequireTakeMoney();

router_mutate_wallet.post(
    '/payAgentFromWallet',
    authentication,
    handle_payAgentFromWallet.setup,
    handle_payAgentFromWallet.main
);

router_mutate_wallet.post(
    '/createRequireTakeMoney',
    authentication,
    handle_createRequireTakeMoney.setup,
    handle_createRequireTakeMoney.main
);

router_mutate_wallet.put(
    '/editRequireTakeMoney',
    authentication,
    handle_editRequireTakeMoney.setup,
    handle_editRequireTakeMoney.main
);

export default router_mutate_wallet;
