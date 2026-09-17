import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_Get_My_Check_In_Outs from './handle/Get_My_Check_In_Outs';
import Handle_Get_Check_In_Outs_With_Date from './handle/Get_Check_In_Outs_With_Date';
import Handle_Get_Check_In_Out_Inspect_With_Fk from './handle/Get_Check_In_Out_Inspect_With_Fk';

const router_query_checkInOut: Router = express.Router();

const handle_get_my_check_in_outs = new Handle_Get_My_Check_In_Outs();
const handle_get_check_in_outs_with_date = new Handle_Get_Check_In_Outs_With_Date();
const handle_get_check_in_out_inspect_with_fk = new Handle_Get_Check_In_Out_Inspect_With_Fk();

router_query_checkInOut.post('/get_my_check_in_outs', authentication, handle_get_my_check_in_outs.main);

router_query_checkInOut.post('/get_check_in_outs_with_date', authentication, handle_get_check_in_outs_with_date.main);

router_query_checkInOut.post(
    '/get_check_in_out_inspect_with_fk',
    authentication,
    handle_get_check_in_out_inspect_with_fk.main
);

export default router_query_checkInOut;
