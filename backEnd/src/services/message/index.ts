import express, { Express } from 'express';
import dotenv from 'dotenv';
import { createMessageFromCustomerSend } from './queue';

dotenv.config();
createMessageFromCustomerSend();

import router_query_message from './router/query';
import router_mutate_message from './router/mutate';

const service_message: Express = express();

service_message.use(`/query`, router_query_message);
service_message.use(`/mutate`, router_mutate_message);

export default service_message;
