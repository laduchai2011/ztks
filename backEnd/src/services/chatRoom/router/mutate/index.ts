import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_UpdateSetupChatRoomRole from './handle/UpdateSetupChatRoomRole';
// import Handle_CreateChatRoomRole from './handle/CreateChatRoomRole';

dotenv.config();

const router_mutate_chatRoom: Router = express.Router();
const handle_updateSetupChatRoomRole = new Handle_UpdateSetupChatRoomRole();
// const handle_createChatRoomRole = new Handle_CreateChatRoomRole();

router_mutate_chatRoom.patch(
    '/updateSetupChatRoomRole',
    authentication,
    handle_updateSetupChatRoomRole.setup,
    handle_updateSetupChatRoomRole.main
);

// router_mutate_chatRoom.patch(
//     '/createChatRoomRole',
//     authentication,
//     handle_createChatRoomRole.setup,
//     handle_createChatRoomRole.main
// );

export default router_mutate_chatRoom;
