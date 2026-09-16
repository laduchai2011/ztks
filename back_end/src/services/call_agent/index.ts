import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_callAgent from './router/query';
import router_mutate_callAgent from './router/mutate';

const service_callAgent: Express = express();

service_callAgent.use(`/query`, router_query_callAgent);
service_callAgent.use(`/mutate`, router_mutate_callAgent);

export default service_callAgent;
