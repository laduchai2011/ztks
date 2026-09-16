import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_GetChatRoomWithId from './handle/GetChatRoomWithId';
import Handle_GetChatRoomRoleWithCridAaid from './handle/GetChatRoomRoleWithCridAaid';
import Handle_GetChatRoomsMongo from './handle/GetChatRoomsMongo';
import Handle_GetMyChatRooms from './handle/GetMyChatRooms';
import Handle_GetListChatRoomPhones from './handle/GetListChatRoomPhones';
import Handle_GetLatestChatRoomPhone from './handle/GetLatestChatRoomPhone';

const router_query_chatRoom: Router = express.Router();

const handle_getMyChatRooms = new Handle_GetMyChatRooms();
const handle_getChatRoomWithId = new Handle_GetChatRoomWithId();
const handle_getChatRoomRoleWithCridAaid = new Handle_GetChatRoomRoleWithCridAaid();
const handle_getChatRoomsMongo = new Handle_GetChatRoomsMongo();
const handle_getListChatRoomPhones = new Handle_GetListChatRoomPhones();
const handle_getLatestChatRoomPhone = new Handle_GetLatestChatRoomPhone();

router_query_chatRoom.post('/getMyChatRooms', authentication, handle_getMyChatRooms.main);

router_query_chatRoom.post('/getChatRoomWithId', authentication, handle_getChatRoomWithId.main);

router_query_chatRoom.post('/getChatRoomRoleWithCridAaid', authentication, handle_getChatRoomRoleWithCridAaid.main);

router_query_chatRoom.post('/getChatRoomsMongo', authentication, handle_getChatRoomsMongo.main);

router_query_chatRoom.post(
    '/getListChatRoomPhones',
    authentication,
    handle_getListChatRoomPhones.setup,
    handle_getListChatRoomPhones.main
);

router_query_chatRoom.post(
    '/getLatestChatRoomPhone',
    authentication,
    handle_getLatestChatRoomPhone.setup,
    handle_getLatestChatRoomPhone.main
);

export default router_query_chatRoom;
