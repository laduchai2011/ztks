import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Get_Chat_Room_Role_With_Crid_Aaid from './handle/Get_Chat_Room_Role_With_Crid_Aaid';
import Handle_Get_Messages_For_Chat_Screen from './handle/Get_Messages_For_Chat_Screen';
import Handle_Get_Last_Message from './handle/Get_Last_Message';
import Handle_Get_Last_Message_With_Uid from './handle/Get_Last_Message_With_Uid';
import Handle_Get_Message_With_Id from './handle/Get_Message_With_Id';
import Handle_Get_Message_With_Msg_Id from './handle/Get_Message_With_Msg_Id';
import Handle_Get_All_New_Messages from './handle/Get_All_New_Messages';

dotenv.config();
const router_query_message_v1: Router = express.Router();

const handle_get_chat_room_role_with_crid_aaid = new Handle_Get_Chat_Room_Role_With_Crid_Aaid();
const handle_get_messages_for_chat_screen = new Handle_Get_Messages_For_Chat_Screen();
const handle_get_last_message = new Handle_Get_Last_Message();
const handle_get_last_message_with_uid = new Handle_Get_Last_Message_With_Uid();
const handle_get_message_with_id = new Handle_Get_Message_With_Id();
const handle_get_message_with_msg_id = new Handle_Get_Message_With_Msg_Id();
const handle_get_all_new_messages = new Handle_Get_All_New_Messages();

router_query_message_v1.post(
    '/get_messages_for_chat_screen',
    authentication,
    handle_get_chat_room_role_with_crid_aaid.setup,
    handle_get_chat_room_role_with_crid_aaid.main,
    handle_get_chat_room_role_with_crid_aaid.pass_Role,
    handle_get_messages_for_chat_screen.main
);

router_query_message_v1.get(
    '/get_last_message',
    authentication,
    handle_get_last_message.setup,
    handle_get_last_message.get_Role,
    handle_get_last_message.is_Pass_Role,
    handle_get_last_message.main
);

router_query_message_v1.get('/get_last_message_with_uid', authentication, handle_get_last_message_with_uid.main);

router_query_message_v1.get('/get_message_with_id', authentication, handle_get_message_with_id.main);

router_query_message_v1.get('/get_message_with_msg_id', authentication, handle_get_message_with_msg_id.main);

router_query_message_v1.get(
    '/get_all_new_messages',
    authentication,
    handle_get_all_new_messages.setup,
    handle_get_all_new_messages.get_Role,
    handle_get_all_new_messages.is_Pass_Role,
    handle_get_all_new_messages.main
);

export default router_query_message_v1;
