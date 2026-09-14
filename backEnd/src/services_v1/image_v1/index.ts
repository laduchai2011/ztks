import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_image_v1 from './router/query';
import router_mutate_image_v1 from './router/mutate';
// import router_store_image from './router/store';

const service_image_v1: Express = express();

service_image_v1.use(`/query`, router_query_image_v1);
service_image_v1.use(`/mutate`, router_mutate_image_v1);
// service_image.use(`/store`, router_store_image);

export default service_image_v1;
