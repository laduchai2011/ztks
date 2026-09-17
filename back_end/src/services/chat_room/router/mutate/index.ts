import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Update_Setup_Chat_Room_Role from './handle/Update_Setup_Chat_Room_Role';
import Handle_Change_Chat_Room_Master from './handle/Change_Chat_Room_Master';
import Handle_Create_Chat_Room_Phone from './handle/Create_Chat_Room_Phone';

dotenv.config();

const router_mutate_chatRoom: Router = express.Router();
const handle_update_setup_chat_room_role = new Handle_Update_Setup_Chat_Room_Role();
const handle_change_chat_room_master = new Handle_Change_Chat_Room_Master();
const handle_create_chat_room_phone = new Handle_Create_Chat_Room_Phone();

router_mutate_chatRoom.patch(
    '/update_setup_chat_room_role',
    authentication,
    handle_update_setup_chat_room_role.setup,
    handle_update_setup_chat_room_role.main
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
