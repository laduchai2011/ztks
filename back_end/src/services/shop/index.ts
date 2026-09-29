import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_shop from './router/query';
import router_mutate_shop from './router/mutate';

const service_shop: Express = express();

service_shop.use(`/query`, router_query_shop);
service_shop.use(`/mutate`, router_mutate_shop);

export default service_shop;
