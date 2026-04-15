import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetChatRoomRoleWithCridAaid from './handle/GetChatRoomRoleWithCridAaid';
import Handle_CreateMessageV1 from './handle/CreateMessageV1';
import Handle_DelAllNewMessages from './handle/DelAllNewMessages';
import Handle_VideoMessage from './handle/VideoMessage';

dotenv.config();

const router_mutate_message_v1: Router = express.Router();
const handle_getChatRoomRoleWithCridAaid = new Handle_GetChatRoomRoleWithCridAaid();
const handle_createMessageV1 = new Handle_CreateMessageV1();
const handle_delAllNewMessages = new Handle_DelAllNewMessages();
const handle_videoMessage = new Handle_VideoMessage();

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

router_mutate_message_v1.post(
    '/videoMessage',
    authentication,
    handle_videoMessage.setup,
    handle_videoMessage.getMyAccountInformation,
    handle_videoMessage.isHasAdmin,
    handle_videoMessage.getZaloApp,
    handle_videoMessage.isPassZaloApp,
    handle_videoMessage.getZaloOa,
    handle_videoMessage.isPassZaloOa,
    handle_videoMessage.getAgent,
    handle_videoMessage.checkLimitMessage,
    handle_videoMessage.getChatRoomRole,
    handle_videoMessage.isPassRoom,
    handle_videoMessage.main
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
