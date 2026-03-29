import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_GetMessages from './handle/GetMessages';
import Handle_GetMessagesHasFilter from './handle/GetMessagesHasFilter';

dotenv.config();
const router_query_message: Router = express.Router();

const handle_getMessages = new Handle_GetMessages();
const handle_getMessagesHasFilter = new Handle_GetMessagesHasFilter();

router_query_message.post('/getMessages', handle_getMessages.main);

router_query_message.post('/getMessagesHasFilter', handle_getMessagesHasFilter.main);

export default router_query_message;
