import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetNotes from './handle/GetNotes';

dotenv.config();
const router_query_note: Router = express.Router();

const handle_getNotes = new Handle_GetNotes();

router_query_note.post('/getNotes', authentication, handle_getNotes.setup, handle_getNotes.main);

export default router_query_note;
