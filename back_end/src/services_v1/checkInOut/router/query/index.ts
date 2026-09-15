import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_GetMyCheckInOuts from './handle/GetMyCheckInOuts';
import Handle_GetCheckInOutsWithDate from './handle/GetCheckInOutsWithDate';
import Handle_GetCheckInOutInspectWithFk from './handle/GetCheckInOutInspectWithFk';

const router_query_checkInOut: Router = express.Router();

const handle_getMyCheckInOuts = new Handle_GetMyCheckInOuts();
const handle_getCheckInOutsWithDate = new Handle_GetCheckInOutsWithDate();
const handle_getCheckInOutInspectWithFk = new Handle_GetCheckInOutInspectWithFk();

router_query_checkInOut.post('/getMyCheckInOuts', authentication, handle_getMyCheckInOuts.main);

router_query_checkInOut.post('/getCheckInOutsWithDate', authentication, handle_getCheckInOutsWithDate.main);

router_query_checkInOut.post('/getCheckInOutInspectWithFk', authentication, handle_getCheckInOutInspectWithFk.main);

export default router_query_checkInOut;
