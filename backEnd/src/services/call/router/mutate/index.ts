import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_RequestConsent from './RequestConsent';
import Handle_Outbound from './Outbound';

dotenv.config();

const router_mutate_call: Router = express.Router();
const handle_requestConsent = new Handle_RequestConsent();
const handle_outbound = new Handle_Outbound();

router_mutate_call.post('/requestConsent', authentication, handle_requestConsent.setup, handle_requestConsent.main);

router_mutate_call.post('/outbound', authentication, handle_outbound.setup, handle_outbound.main);

export default router_mutate_call;
