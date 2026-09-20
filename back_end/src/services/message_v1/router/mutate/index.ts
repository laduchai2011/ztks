import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Get_Chat_Room_Role_With_Crid_Aaid from './handle/Get_Chat_Room_Role_With_Crid_Aaid';
import Handle_Create_Message_V1 from './handle/Create_Message_V1';
import Handle_Del_All_New_Messages from './handle/Del_All_New_Messages';
import Handle_Video_Message from './handle/Video_Message';

dotenv.config();

const router_mutate_message_v1: Router = express.Router();
const handle_get_chat_room_role_with_crid_aaid = new Handle_Get_Chat_Room_Role_With_Crid_Aaid();
const handle_create_message_v1 = new Handle_Create_Message_V1();
const handle_del_all_new_messages = new Handle_Del_All_New_Messages();
const handle_video_message = new Handle_Video_Message();

router_mutate_message_v1.post(
    '/create_message_v1',
    authentication,
    handle_get_chat_room_role_with_crid_aaid.setup,
    handle_get_chat_room_role_with_crid_aaid.main,
    handle_get_chat_room_role_with_crid_aaid.pass_Role,
    handle_create_message_v1.setup,
    handle_create_message_v1.get_Zalo_App,
    handle_create_message_v1.get_Zalo_Oa,
    handle_create_message_v1.get_Agent,
    handle_create_message_v1.check_Limit_Message,
    handle_create_message_v1.main
);

router_mutate_message_v1.post(
    '/video_message',
    authentication,
    handle_video_message.setup,
    handle_video_message.get_My_Account_Information,
    handle_video_message.is_Has_Admin,
    handle_video_message.get_Zalo_App,
    handle_video_message.is_Pass_Zalo_App,
    handle_video_message.get_Zalo_Oa,
    handle_video_message.is_Pass_Zalo_Oa,
    handle_video_message.get_Agent,
    handle_video_message.check_Limit_Message,
    handle_video_message.get_Chat_Room_Role,
    handle_video_message.is_Pass_Room,
    handle_video_message.main
);

router_mutate_message_v1.get(
    '/del_all_new_messages',
    authentication,
    handle_del_all_new_messages.setup,
    handle_del_all_new_messages.get_Role,
    handle_del_all_new_messages.is_Pass_Role,
    handle_del_all_new_messages.main
);

export default router_mutate_message_v1;
