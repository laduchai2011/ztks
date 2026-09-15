import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_voucher from './router/query';
import router_mutate_voucher from './router/mutate';

const service_voucher: Express = express();

service_voucher.use(`/query`, router_query_voucher);
service_voucher.use(`/mutate`, router_mutate_voucher);

export default service_voucher;
