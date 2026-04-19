import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_bank from './router/query';
import router_mutate_bank from './router/mutate';

const service_bank: Express = express();

service_bank.use(`/query`, router_query_bank);
service_bank.use(`/mutate`, router_mutate_bank);

export default service_bank;
