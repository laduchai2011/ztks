import express, { Express } from 'express';

import router_query_chatSession from './router/query';
import router_mutate_chatSession from './router/mutate';

const service_chatSession: Express = express();

service_chatSession.use(`/query`, router_query_chatSession);
service_chatSession.use(`/mutate`, router_mutate_chatSession);

export default service_chatSession;
