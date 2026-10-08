import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Team from './handle/Create_Team';
import Handle_Add_Team_Member from './handle/Add_Team_Member';

dotenv.config();

const router_mutate_team: Router = express.Router();

const handle_create_team = new Handle_Create_Team();
const handle_add_team_member = new Handle_Add_Team_Member();

router_mutate_team.post('/create_team', authentication, handle_create_team.setup, handle_create_team.main);

router_mutate_team.post('/add_team_member', authentication, handle_add_team_member.setup, handle_add_team_member.main);

export default router_mutate_team;
