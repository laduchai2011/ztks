import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// import router_query_order from './router/query';
import router_mutate_order_v1 from './router/mutate';

const service_order_v1: Express = express();

// service_order.use(`/query`, router_query_order);
service_order_v1.use(`/mutate`, router_mutate_order_v1);

export default service_order_v1;
