import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Get_Notes from './handle/Get_Notes';

dotenv.config();
const router_query_note: Router = express.Router();

const handle_get_notes = new Handle_Get_Notes();

router_query_note.post('/get_notes', authentication, handle_get_notes.setup, handle_get_notes.main);

export default router_query_note;
