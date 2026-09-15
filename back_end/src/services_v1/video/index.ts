import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_get_video from './router/query';
import router_mutate_video from './router/mutate';
import router_store_video from './router/store';

const service_video: Express = express();

service_video.use('/query', router_get_video);
service_video.use('/mutate', router_mutate_video);
service_video.use('/store', router_store_video);

export default service_video;
