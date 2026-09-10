import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_CreateCheckInOut from './handle/CreateCheckInOut';
import Handle_CreateCheckInOutInspect from './handle/CreateCheckInOutInspect';

dotenv.config();

const router_mutate_checkInOut: Router = express.Router();
const handle_createCheckInOut = new Handle_CreateCheckInOut();
const handle_createCheckInOutInspect = new Handle_CreateCheckInOutInspect();

router_mutate_checkInOut.post(
    '/createCheckInOut',
    authentication,
    handle_createCheckInOut.setup,
    handle_createCheckInOut.main
);

router_mutate_checkInOut.post(
    '/createCheckInOutInspect',
    authentication,
    handle_createCheckInOutInspect.setup,
    handle_createCheckInOutInspect.main
);

export default router_mutate_checkInOut;
