import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Team from './handle/Create_Team';
import Handle_Add_Team_Member from './handle/Add_Team_Member';
import Handle_Lock_Team from './handle/Lock_Team';
import Handle_Lock_Team_Member from './handle/Lock_Team_Member';
import Handle_Delete_Team from './handle/Delete_Team';
import Handle_Delete_Team_Member from './handle/Delete_Team_Member';
import Handle_Edit_Team from './handle/Edit_Team';

dotenv.config();

const router_mutate_team: Router = express.Router();

const handle_create_team = new Handle_Create_Team();
const handle_add_team_member = new Handle_Add_Team_Member();
const handle_lock_team = new Handle_Lock_Team();
const handle_lock_team_member = new Handle_Lock_Team_Member();
const handle_edit_team = new Handle_Edit_Team();
const handle_delete_team = new Handle_Delete_Team();
const handle_delete_team_member = new Handle_Delete_Team_Member();

router_mutate_team.post('/create_team', authentication, handle_create_team.setup, handle_create_team.main);

router_mutate_team.post('/add_team_member', authentication, handle_add_team_member.setup, handle_add_team_member.main);

router_mutate_team.post('/lock_team', authentication, handle_lock_team.setup, handle_lock_team.main);

router_mutate_team.post(
    '/lock_team_member',
    authentication,
    handle_lock_team_member.setup,
    handle_lock_team_member.main
);

router_mutate_team.post('/edit_team', authentication, handle_edit_team.setup, handle_edit_team.main);

router_mutate_team.post('/delete_team', authentication, handle_delete_team.setup, handle_delete_team.main);

router_mutate_team.post(
    '/delete_team_member',
    authentication,
    handle_delete_team_member.setup,
    handle_delete_team_member.main
);

export default router_mutate_team;
