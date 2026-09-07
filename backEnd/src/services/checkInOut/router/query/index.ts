import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_GetMyCheckInOuts from './handle/GetMyCheckInOuts';

const router_query_checkInOut: Router = express.Router();

const handle_getMyCheckInOuts = new Handle_GetMyCheckInOuts();

router_query_checkInOut.post('/getMyCheckInOuts', authentication, handle_getMyCheckInOuts.main);

export default router_query_checkInOut;
