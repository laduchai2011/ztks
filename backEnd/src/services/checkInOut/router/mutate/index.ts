import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_CreateCheckInOut from './handle/CreateCheckInOut';
// import Handle_UpdateSelectedAccountIdOfChatSession from './handle/UpdateSelectedAccountIdOfChatSession';
// import Handle_UpdateIsReadyOfChatSession from './handle/UpdateIsReadyOfChatSession';
// import Handle_LeaveAllChatSession from './handle/LeaveAllChatSession';

dotenv.config();

const router_mutate_checkInOut: Router = express.Router();
const handle_createCheckInOut = new Handle_CreateCheckInOut();
// const handle_updateSelectedAccountIdOfChatSession = new Handle_UpdateSelectedAccountIdOfChatSession();
// const handle_updateIsReadyOfChatSession = new Handle_UpdateIsReadyOfChatSession();
// const handle_leaveAllChatSession = new Handle_LeaveAllChatSession();

router_mutate_checkInOut.post(
    '/createCheckInOut',
    authentication,
    handle_createCheckInOut.setup,
    handle_createCheckInOut.main
);

// router_mutate_chatSession.patch(
//     '/updateSelectedAccountIdOfChatSession',
//     authentication,
//     handle_updateSelectedAccountIdOfChatSession.setup,
//     handle_updateSelectedAccountIdOfChatSession.main
// );

// router_mutate_chatSession.patch(
//     '/updateIsReadyOfChatSession',
//     authentication,
//     handle_updateIsReadyOfChatSession.setup,
//     handle_updateIsReadyOfChatSession.main
// );

// router_mutate_chatSession.patch(
//     '/leaveAllChatSession',
//     authentication,
//     handle_leaveAllChatSession.setup,
//     handle_leaveAllChatSession.main
// );

export default router_mutate_checkInOut;
