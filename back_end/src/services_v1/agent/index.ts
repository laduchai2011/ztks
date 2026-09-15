import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_agent from './router/query';
import router_mutate_agent from './router/mutate';

const service_agent: Express = express();

service_agent.use(`/query`, router_query_agent);
service_agent.use(`/mutate`, router_mutate_agent);

export default service_agent;
