import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Get_Mcc_Info from './handle/Get_Mcc_Info';
import Handle_Check_Consent from './handle/Check_Consent';

dotenv.config();

const router_query_call: Router = express.Router();
const handle_get_mcc_info = new Handle_Get_Mcc_Info();
const handle_check_consent = new Handle_Check_Consent();

router_query_call.post('/get_mcc_info', authentication, handle_get_mcc_info.setup, handle_get_mcc_info.main);

router_query_call.post('/check_consent', authentication, handle_check_consent.setup, handle_check_consent.main);

export default router_query_call;
