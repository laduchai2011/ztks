import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_GetMyCheckInOuts from './handle/GetMyCheckInOuts';
import Handle_GetCheckInOutsWithDate from './handle/GetCheckInOutsWithDate';

const router_query_checkInOut: Router = express.Router();

const handle_getMyCheckInOuts = new Handle_GetMyCheckInOuts();
const handle_getCheckInOutsWithDate = new Handle_GetCheckInOutsWithDate();

router_query_checkInOut.post('/getMyCheckInOuts', authentication, handle_getMyCheckInOuts.main);

router_query_checkInOut.post('/getCheckInOutsWithDate', authentication, handle_getCheckInOutsWithDate.main);

export default router_query_checkInOut;
