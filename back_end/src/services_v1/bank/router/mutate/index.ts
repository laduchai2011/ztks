import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_AddBank from './handle/AddBank';
import Handle_EditBank from './handle/EditBank';
import Handle_DeleteBank from './handle/DeleteBank';

dotenv.config();

const router_mutate_bank: Router = express.Router();
const handle_addBank = new Handle_AddBank();
const handle_editBank = new Handle_EditBank();
const handle_deleteBank = new Handle_DeleteBank();

router_mutate_bank.post('/addBank', authentication, handle_addBank.setup, handle_addBank.main);

router_mutate_bank.patch('/editBank', authentication, handle_editBank.setup, handle_editBank.main);

router_mutate_bank.delete('/deleteBank', authentication, handle_deleteBank.setup, handle_deleteBank.main);

export default router_mutate_bank;
