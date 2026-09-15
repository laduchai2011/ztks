import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_message_v1 from './router/query';
import router_mutate_message_v1 from './router/mutate';

const service_message_v1: Express = express();

service_message_v1.use(`/query`, router_query_message_v1);
service_message_v1.use(`/mutate`, router_mutate_message_v1);

export default service_message_v1;
