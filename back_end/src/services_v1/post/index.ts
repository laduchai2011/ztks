import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_post from './router/query';
import router_mutate_post from './router/mutate';

const service_post: Express = express();

service_post.use(`/query`, router_query_post);
service_post.use(`/mutate`, router_mutate_post);

export default service_post;
