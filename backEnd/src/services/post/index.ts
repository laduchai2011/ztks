import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_post from './router/query';
// import router_mutate_order from './router/mutate';

const service_post: Express = express();

service_post.use(`/query`, router_query_post);
// service_order.use(`/mutate`, router_mutate_order);

export default service_post;
