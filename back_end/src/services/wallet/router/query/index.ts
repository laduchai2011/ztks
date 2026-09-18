import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Get_My_Wallet_With_Type from './handle/Get_My_Wallet_With_Type';
import Handle_Get_Balance_Fluctuations from './handle/Get_Balance_Fluctuations';
import Handle_Member_Get_Require_Take_Money_Of_Wallet from './handle/Member_Get_Require_Take_Money_Of_Wallet';
import Handle_Member_Ztks_Get_Requires_Take_Money from './handle/Member_Ztks_Get_Requires_Take_Money';
import Handle_Get_Require_With_Id from './handle/Get_Require_With_Id';

dotenv.config();
const router_query_wallet: Router = express.Router();

const handle_get_my_wallet_with_type = new Handle_Get_My_Wallet_With_Type();
const handle_get_balance_fluctuations = new Handle_Get_Balance_Fluctuations();
const handle_member_get_require_take_money_of_wallet = new Handle_Member_Get_Require_Take_Money_Of_Wallet();
const handle_member_ztks_get_requires_take_money = new Handle_Member_Ztks_Get_Requires_Take_Money();
const handle_get_require_with_id = new Handle_Get_Require_With_Id();

router_query_wallet.post(
    '/get_my_wallet_with_type',
    authentication,
    handle_get_my_wallet_with_type.setup,
    handle_get_my_wallet_with_type.main
);

router_query_wallet.post('/get_balance_fluctuations', authentication, handle_get_balance_fluctuations.main);

router_query_wallet.post(
    '/member_get_require_take_money_of_wallet',
    authentication,
    handle_member_get_require_take_money_of_wallet.main
);

router_query_wallet.post(
    '/member_ztks_get_requires_take_money',
    authentication,
    handle_member_ztks_get_requires_take_money.main
);

router_query_wallet.post('/get_require_with_id', authentication, handle_get_require_with_id.main);

export default router_query_wallet;
