import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Pay_Agent_From_Wallet from './handle/Pay_Agent_From_Wallet';
import Handle_Create_Require_Take_Money from './handle/Create_Require_Take_Money';
import Handle_Edit_Require_Take_Money from './handle/Edit_Require_Take_Money';
import Handle_DeleteRequireTakeMoney from './handle/Delete_Require_Take_Money';
import Handle_Member_Ztks_Confirm_Take_Money from './handle/Member_Ztks_Confirm_Take_Money';

dotenv.config();

const router_mutate_wallet: Router = express.Router();

const handle_pay_agent_from_wallet = new Handle_Pay_Agent_From_Wallet();
const handle_create_require_take_money = new Handle_Create_Require_Take_Money();
const handle_edit_require_take_money = new Handle_Edit_Require_Take_Money();
const handle_delete_require_take_money = new Handle_DeleteRequireTakeMoney();
const handle_member_ztks_confirm_take_money = new Handle_Member_Ztks_Confirm_Take_Money();

router_mutate_wallet.post(
    '/pay_agent_from_wallet',
    authentication,
    handle_pay_agent_from_wallet.setup,
    handle_pay_agent_from_wallet.main
);

router_mutate_wallet.post(
    '/create_require_take_money',
    authentication,
    handle_create_require_take_money.setup,
    handle_create_require_take_money.main
);

router_mutate_wallet.put(
    '/edit_require_take_money',
    authentication,
    handle_edit_require_take_money.setup,
    handle_edit_require_take_money.main
);

router_mutate_wallet.put(
    '/delete_require_take_money',
    authentication,
    handle_delete_require_take_money.setup,
    handle_delete_require_take_money.main
);

router_mutate_wallet.put('/member_ztks_confirm_take_money', authentication, handle_member_ztks_confirm_take_money.main);

export default router_mutate_wallet;
