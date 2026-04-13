import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_video_v1 from './router/query';
import router_mutate_video_v1 from './router/mutate';
// import router_store_image from './router/store';

const service_video_v1: Express = express();

service_video_v1.use(`/query`, router_query_video_v1);
service_video_v1.use(`/mutate`, router_mutate_video_v1);
// service_image.use(`/store`, router_store_image);

export default service_video_v1;
