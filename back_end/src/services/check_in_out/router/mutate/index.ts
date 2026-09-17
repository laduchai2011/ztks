import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Check_In_Out from './handle/Create_Check_In_Out';
import Handle_Create_Check_In_Out_Inspect from './handle/Create_Check_In_Out_Inspect';

dotenv.config();

const router_mutate_checkInOut: Router = express.Router();
const handle_create_check_in_out = new Handle_Create_Check_In_Out();
const handle_create_check_in_out_inspect = new Handle_Create_Check_In_Out_Inspect();

router_mutate_checkInOut.post(
    '/create_check_in_out',
    authentication,
    handle_create_check_in_out.setup,
    handle_create_check_in_out.main
);

router_mutate_checkInOut.post(
    '/create_check_in_out_inspect',
    authentication,
    handle_create_check_in_out_inspect.setup,
    handle_create_check_in_out_inspect.main
);

export default router_mutate_checkInOut;
