import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_Get_Chat_Room_With_Id from './handle/Get_Chat_Room_With_Id';
import Handle_Get_Chat_Room_Role_With_Crid_Aaid from './handle/Get_Chat_Room_Role_With_Crid_Aaid';
import Handle_Get_Chat_Rooms_Mongo from './handle/Get_Chat_Rooms_Mongo';
import Handle_Get_My_Chat_Rooms from './handle/Get_My_Chat_Rooms';
import Handle_Get_List_Chat_Room_Phones from './handle/Get_List_Chat_Room_Phones';
import Handle_Get_Latest_Chat_Room_Phone from './handle/Get_Latest_Chat_Room_Phone';

const router_query_chatRoom: Router = express.Router();

const handle_get_my_chat_rooms = new Handle_Get_My_Chat_Rooms();
const handle_get_chat_room_with_id = new Handle_Get_Chat_Room_With_Id();
const handle_get_chat_room_role_with_crid_aaid = new Handle_Get_Chat_Room_Role_With_Crid_Aaid();
const handle_get_chat_rooms_mongo = new Handle_Get_Chat_Rooms_Mongo();
const handle_get_list_chat_room_phones = new Handle_Get_List_Chat_Room_Phones();
const handle_get_latest_chat_room_phone = new Handle_Get_Latest_Chat_Room_Phone();

router_query_chatRoom.post('/get_my_chat_rooms', authentication, handle_get_my_chat_rooms.main);

router_query_chatRoom.post('/get_chat_room_with_id', authentication, handle_get_chat_room_with_id.main);

router_query_chatRoom.post('/get_chat_room_role_with_crid_aaid', authentication, handle_get_chat_room_role_with_crid_aaid.main);

router_query_chatRoom.post('/get_chat_rooms_mongo', authentication, handle_get_chat_rooms_mongo.main);

router_query_chatRoom.post(
    '/get_list_chat_room_phones',
    authentication,
    handle_get_list_chat_room_phones.setup,
    handle_get_list_chat_room_phones.main
);

router_query_chatRoom.post(
    '/get_latest_chat_room_phone',
    authentication,
    handle_get_latest_chat_room_phone.setup,
    handle_get_latest_chat_room_phone.main
);

export default router_query_chatRoom;
