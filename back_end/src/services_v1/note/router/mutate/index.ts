import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_CreateNote from './handle/CreateNote';
import Handle_UpdateNote from './handle/UpdateNote';
import Handle_DeleteNote from './handle/DeleteNote';

dotenv.config();

const router_mutate_note: Router = express.Router();

const handle_createNote = new Handle_CreateNote();
const handle_updateNote = new Handle_UpdateNote();
const handle_deleteNote = new Handle_DeleteNote();

router_mutate_note.post('/createNote', authentication, handle_createNote.setup, handle_createNote.main);

router_mutate_note.patch('/updateNote', authentication, handle_updateNote.setup, handle_updateNote.main);

router_mutate_note.patch('/deleteNote', authentication, handle_deleteNote.setup, handle_deleteNote.main);

export default router_mutate_note;
