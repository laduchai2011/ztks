import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import router_query_note from './router/query';
import router_mutate_note from './router/mutate';

const service_note: Express = express();

service_note.use(`/query`, router_query_note);
service_note.use(`/mutate`, router_mutate_note);

export default service_note;
