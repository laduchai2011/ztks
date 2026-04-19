import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_AddBank from './handle/AddBank';
import Handle_EditBank from './handle/EditBank';

dotenv.config();

const router_mutate_bank: Router = express.Router();
const handle_addBank = new Handle_AddBank();
const handle_editBank = new Handle_EditBank();

router_mutate_bank.post('/addBank', authentication, handle_addBank.setup, handle_addBank.main);

router_mutate_bank.put('/editBank', authentication, handle_editBank.setup, handle_editBank.main);

export default router_mutate_bank;
