import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_call from './router/query';
import router_mutate_call from './router/mutate';

const service_call: Express = express();

service_call.use(`/query`, router_query_call);
service_call.use(`/mutate`, router_mutate_call);

export default service_call;
