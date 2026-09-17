import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Chat_Session from './handle/Create_Chat_Session';
import Handle_Update_Selected_Account_Id_Of_Chat_Session from './handle/Update_Selected_Account_Id_Of_Chat_Session';
import Handle_Update_Is_Ready_Of_Chat_Session from './handle/Update_Is_Ready_Of_Chat_Session';
import Handle_Leave_All_Chat_Session from './handle/Leave_All_Chat_Session';

dotenv.config();

const router_mutate_chatSession: Router = express.Router();
const handle_create_chat_session = new Handle_Create_Chat_Session();
const handle_update_selected_account_id_of_chat_session = new Handle_Update_Selected_Account_Id_Of_Chat_Session();
const handle_update_is_ready_of_chat_session = new Handle_Update_Is_Ready_Of_Chat_Session();
const handle_leave_all_chat_session = new Handle_Leave_All_Chat_Session();

router_mutate_chatSession.post(
    '/create_chat_session',
    authentication,
    handle_create_chat_session.setup,
    handle_create_chat_session.is_My_Oa,
    handle_create_chat_session.main
);

router_mutate_chatSession.patch(
    '/update_selected_account_id_of_chat_session',
    authentication,
    handle_update_selected_account_id_of_chat_session.setup,
    handle_update_selected_account_id_of_chat_session.main
);

router_mutate_chatSession.patch(
    '/update_is_ready_of_chat_session',
    authentication,
    handle_update_is_ready_of_chat_session.setup,
    handle_update_is_ready_of_chat_session.main
);

router_mutate_chatSession.patch(
    '/leave_all_chat_session',
    authentication,
    handle_leave_all_chat_session.setup,
    handle_leave_all_chat_session.main
);

export default router_mutate_chatSession;
