import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_CreateChatSession from './handle/CreateChatSession';
import Handle_Update_Selected_Account_Id_Of_Chat_Session from './handle/Update_Selected_Account_Id_Of_Chat_Session';
import Handle_UpdateIsReadyOfChatSession from './handle/UpdateIsReadyOfChatSession';
import Handle_LeaveAllChatSession from './handle/LeaveAllChatSession';

dotenv.config();

const router_mutate_chatSession: Router = express.Router();
const handle_createChatSession = new Handle_CreateChatSession();
const handle_update_selected_account_id_of_chat_session = new Handle_Update_Selected_Account_Id_Of_Chat_Session();
const handle_updateIsReadyOfChatSession = new Handle_UpdateIsReadyOfChatSession();
const handle_leaveAllChatSession = new Handle_LeaveAllChatSession();

router_mutate_chatSession.post(
    '/createChatSession',
    authentication,
    handle_createChatSession.setup,
    handle_createChatSession.isMyOa,
    handle_createChatSession.main
);

router_mutate_chatSession.patch(
    '/update_selected_account_id_of_chat_session',
    authentication,
    handle_update_selected_account_id_of_chat_session.setup,
    handle_update_selected_account_id_of_chat_session.main
);

router_mutate_chatSession.patch(
    '/updateIsReadyOfChatSession',
    authentication,
    handle_updateIsReadyOfChatSession.setup,
    handle_updateIsReadyOfChatSession.main
);

router_mutate_chatSession.patch(
    '/leaveAllChatSession',
    authentication,
    handle_leaveAllChatSession.setup,
    handle_leaveAllChatSession.main
);

export default router_mutate_chatSession;
