import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Add_Bank from './handle/Add_Bank';
import Handle_Edit_Bank from './handle/Edit_Bank';
import Handle_Delete_Bank from './handle/Delete_Bank';

dotenv.config();

const router_mutate_bank: Router = express.Router();
const handle_add_bank = new Handle_Add_Bank();
const handle_edit_bank = new Handle_Edit_Bank();
const handle_delete_bank = new Handle_Delete_Bank();

router_mutate_bank.post('/add_bank', authentication, handle_add_bank.setup, handle_add_bank.main);

router_mutate_bank.patch('/edit_bank', authentication, handle_edit_bank.setup, handle_edit_bank.main);

router_mutate_bank.delete('/delete_bank', authentication, handle_delete_bank.setup, handle_delete_bank.main);

export default router_mutate_bank;
