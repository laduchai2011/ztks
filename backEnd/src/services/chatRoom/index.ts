import express, { Express } from 'express';

import router_query_chatRoom from './router/query';
import router_mutate_chatRoom from './router/mutate';

const service_chatRoom: Express = express();

service_chatRoom.use(`/query`, router_query_chatRoom);
service_chatRoom.use(`/mutate`, router_mutate_chatRoom);

export default service_chatRoom;
