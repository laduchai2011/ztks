import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_statistics from './router/query';
// import router_mutate_post from './router/mutate';

const service_statistics: Express = express();

service_statistics.use(`/query`, router_query_statistics);
// service_post.use(`/mutate`, router_mutate_post);

export default service_statistics;
