import express, { Express } from 'express';

import router_query_customer from './router/query';
import router_mutate_customer from './router/mutate';

const service_customer: Express = express();

service_customer.use(`/query`, router_query_customer);
service_customer.use(`/mutate`, router_mutate_customer);

export default service_customer;
