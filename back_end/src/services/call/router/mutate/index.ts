import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Request_Consent from './Request_Consent';
import Handle_Outbound from './Outbound';

dotenv.config();

const router_mutate_call: Router = express.Router();
const handle_request_consent = new Handle_Request_Consent();
const handle_outbound = new Handle_Outbound();

router_mutate_call.post('/request_consent', authentication, handle_request_consent.setup, handle_request_consent.main);

router_mutate_call.post('/outbound', authentication, handle_outbound.setup, handle_outbound.main);

export default router_mutate_call;
