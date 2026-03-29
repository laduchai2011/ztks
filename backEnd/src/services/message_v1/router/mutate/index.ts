import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetChatRoomRoleWithCridAaid from './handle/GetChatRoomRoleWithCridAaid';
import Handle_CreateMessageV1 from './CreateMessageV1';
import Handle_DelAllNewMessages from './handle/DelAllNewMessages';

dotenv.config();

const router_mutate_message_v1: Router = express.Router();
const handle_getChatRoomRoleWithCridAaid = new Handle_GetChatRoomRoleWithCridAaid();
const handle_createMessageV1 = new Handle_CreateMessageV1();
const handle_delAllNewMessages = new Handle_DelAllNewMessages();

router_mutate_message_v1.post(
    '/createMessageV1',
    authentication,
    handle_getChatRoomRoleWithCridAaid.setup,
    handle_getChatRoomRoleWithCridAaid.main,
    handle_getChatRoomRoleWithCridAaid.passRole,
    handle_createMessageV1.setup,
    handle_createMessageV1.getZaloApp,
    handle_createMessageV1.getZaloOa,
    handle_createMessageV1.getAgent,
    handle_createMessageV1.checkLimitMessage,
    handle_createMessageV1.main
);

router_mutate_message_v1.get(
    '/delAllNewMessages',
    authentication,
    handle_delAllNewMessages.setup,
    handle_delAllNewMessages.getRole,
    handle_delAllNewMessages.isPassRole,
    handle_delAllNewMessages.main
);

export default router_mutate_message_v1;
