import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_team from './router/query';
import router_mutate_team from './router/mutate';

const service_team: Express = express();

service_team.use(`/query`, router_query_team);
service_team.use(`/mutate`, router_mutate_team);

export default service_team;
