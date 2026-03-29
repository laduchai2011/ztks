import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_order from './router/query';
import router_mutate_order from './router/mutate';

const service_order: Express = express();

service_order.use(`/query`, router_query_order);
service_order.use(`/mutate`, router_mutate_order);

export default service_order;
