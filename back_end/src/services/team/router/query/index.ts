import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_Get_Teams from './handle/Get_Teams';
import Handle_Get_Team_Members from './handle/Get_Team_Members';

dotenv.config();
const router_query_team: Router = express.Router();

const handle_get_teams = new Handle_Get_Teams();
const handle_get_team_members = new Handle_Get_Team_Members();

router_query_team.post('/get_teams', handle_get_teams.main);

router_query_team.post('/get_team_members', handle_get_team_members.main);

export default router_query_team;
