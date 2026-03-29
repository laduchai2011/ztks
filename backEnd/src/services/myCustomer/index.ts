import express, { Express } from 'express';
import dotenv from 'dotenv';
import { checkMyCustommer, sendToMember, updateEvent_MemberSend } from './queue';

checkMyCustommer();
sendToMember();
updateEvent_MemberSend();

dotenv.config();

import router_query_myCustomer from './router/query';
import router_mutate_myCustomer from './router/mutate';

const service_myCustomer: Express = express();

service_myCustomer.use(`/query`, router_query_myCustomer);
service_myCustomer.use(`/mutate`, router_mutate_myCustomer);

export default service_myCustomer;
