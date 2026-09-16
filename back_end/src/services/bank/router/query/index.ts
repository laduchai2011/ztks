import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Get_All_Banks from './handle/Get_All_Banks';
import Handle_Get_Bank_With_Id from './handle/Get_Bank_With_Id';

dotenv.config();

const router_query_bank: Router = express.Router();
const handle_get_all_banks = new Handle_Get_All_Banks();
const handle_get_bank_with_id = new Handle_Get_Bank_With_Id();

router_query_bank.post('/get_all_banks', authentication, handle_get_all_banks.setup, handle_get_all_banks.main);

router_query_bank.post('/get_bank_with_id', authentication, handle_get_bank_with_id.main);

export default router_query_bank;
