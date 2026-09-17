import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Note from './handle/Create_Note';
import Handle_Update_Note from './handle/Update_Note';
import Handle_Delete_Note from './handle/Delete_Note';

dotenv.config();

const router_mutate_note: Router = express.Router();

const handle_create_note = new Handle_Create_Note();
const handle_update_note = new Handle_Update_Note();
const handle_delete_note = new Handle_Delete_Note();

router_mutate_note.post('/create_note', authentication, handle_create_note.setup, handle_create_note.main);

router_mutate_note.patch('/update_note', authentication, handle_update_note.setup, handle_update_note.main);

router_mutate_note.patch('/delete_note', authentication, handle_delete_note.setup, handle_delete_note.main);

export default router_mutate_note;
