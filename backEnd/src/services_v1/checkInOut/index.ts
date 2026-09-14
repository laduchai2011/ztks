import express, { Express } from 'express';

import router_query_checkInOut from './router/query';
import router_mutate_checkInOut from './router/mutate';

const service_checkInOut: Express = express();

service_checkInOut.use(`/query`, router_query_checkInOut);
service_checkInOut.use(`/mutate`, router_mutate_checkInOut);

export default service_checkInOut;
