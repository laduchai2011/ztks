import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_CreateMessage from './handle/CreateMessage';
import Handle_UpdateMessageStatus from './handle/UpdateMessageStatus';
import Handle_SendVideoTdFailure from './handle/SendVideoTdFailure';
import Handle_SendVideoTdSuccess from './handle/SendVideoTdSuccess';

dotenv.config();

const router_mutate_message: Router = express.Router();
const handle_createMessage = new Handle_CreateMessage();
const handle_updateMessageStatus = new Handle_UpdateMessageStatus();
const handle_sendVideoTdFailure = new Handle_SendVideoTdFailure();
const handle_sendVideoTdSuccess = new Handle_SendVideoTdSuccess();

router_mutate_message.post('/createMessage', authentication, handle_createMessage.setup, handle_createMessage.main);

router_mutate_message.post(
    '/updateMessageStatus',
    authentication,
    handle_updateMessageStatus.setup,
    handle_updateMessageStatus.main
);

router_mutate_message.post('/sendVideoTdFailure', authentication, handle_sendVideoTdFailure.main);

router_mutate_message.post('/sendVideoTdSuccess', authentication, handle_sendVideoTdSuccess.main);

export default router_mutate_message;
