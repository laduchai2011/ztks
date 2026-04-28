import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_UpdateSetupChatRoomRole from './handle/UpdateSetupChatRoomRole';
import Handle_ChangeChatRoomMaster from './handle/ChangeChatRoomMaster';

dotenv.config();

const router_mutate_chatRoom: Router = express.Router();
const handle_updateSetupChatRoomRole = new Handle_UpdateSetupChatRoomRole();
const handle_changeChatRoomMaster = new Handle_ChangeChatRoomMaster();

router_mutate_chatRoom.patch(
    '/updateSetupChatRoomRole',
    authentication,
    handle_updateSetupChatRoomRole.setup,
    handle_updateSetupChatRoomRole.main
);

router_mutate_chatRoom.patch(
    '/changeChatRoomMaster',
    authentication,
    handle_changeChatRoomMaster.setup,
    handle_changeChatRoomMaster.main
);

export default router_mutate_chatRoom;
