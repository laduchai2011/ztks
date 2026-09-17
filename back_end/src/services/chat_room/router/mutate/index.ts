import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_UpdateSetupChatRoomRole from './handle/Update_Setup_Chat_Room_Role';
import Handle_Change_Chat_Room_Master from './handle/Change_Chat_Room_Master';
import Handle_Create_Chat_Room_Phone from './handle/Create_Chat_Room_Phone';

dotenv.config();

const router_mutate_chatRoom: Router = express.Router();
const handle_updateSetupChatRoomRole = new Handle_UpdateSetupChatRoomRole();
const handle_change_chat_room_master = new Handle_Change_Chat_Room_Master();
const handle_create_chat_room_phone = new Handle_Create_Chat_Room_Phone();

router_mutate_chatRoom.patch(
    '/updateSetupChatRoomRole',
    authentication,
    handle_updateSetupChatRoomRole.setup,
    handle_updateSetupChatRoomRole.main
);

router_mutate_chatRoom.patch(
    '/change_chat_room_master',
    authentication,
    handle_change_chat_room_master.setup,
    handle_change_chat_room_master.main
);

router_mutate_chatRoom.post(
    '/create_chat_room_phone',
    authentication,
    handle_create_chat_room_phone.setup,
    handle_create_chat_room_phone.main
);

export default router_mutate_chatRoom;
