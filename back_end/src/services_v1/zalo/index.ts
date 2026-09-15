import express, { Express } from 'express';

import router_query_zalo from './router/query';
import router_mutate_zalo from './router/mutate';

const service_zalo: Express = express();

service_zalo.use(`/query`, router_query_zalo);
service_zalo.use(`/mutate`, router_mutate_zalo);

export default service_zalo;
