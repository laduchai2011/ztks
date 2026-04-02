import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_wallet from './router/query';
import router_mutate_wallet from './router/mutate';

const service_wallet: Express = express();

service_wallet.use(`/query`, router_query_wallet);
service_wallet.use(`/mutate`, router_mutate_wallet);

export default service_wallet;
