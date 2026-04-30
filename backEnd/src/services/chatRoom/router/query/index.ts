import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_GetChatRoomWithId from './handle/GetChatRoomWithId';
import Handle_GetChatRoomRoleWithCridAaid from './handle/GetChatRoomRoleWithCridAaid';
import Handle_GetChatRoomsMongo from './handle/GetChatRoomsMongo';
import Handle_GetAllMyChatRooms from './handle/GetAllMyChatRooms';

const router_query_chatRoom: Router = express.Router();

const handle_getChatRoomWithId = new Handle_GetChatRoomWithId();
const handle_getChatRoomRoleWithCridAaid = new Handle_GetChatRoomRoleWithCridAaid();
const handle_getChatRoomsMongo = new Handle_GetChatRoomsMongo();
const handle_getAllMyChatRooms = new Handle_GetAllMyChatRooms();

router_query_chatRoom.post('/getChatRoomWithId', authentication, handle_getChatRoomWithId.main);

router_query_chatRoom.post('/getChatRoomRoleWithCridAaid', authentication, handle_getChatRoomRoleWithCridAaid.main);

router_query_chatRoom.post('/getChatRoomsMongo', authentication, handle_getChatRoomsMongo.main);

router_query_chatRoom.post(
    '/getAllMyChatRooms',
    authentication,
    handle_getAllMyChatRooms.setup,
    handle_getAllMyChatRooms.main
);

export default router_query_chatRoom;
