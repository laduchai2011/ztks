import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_Get_Teams from './handle/Get_Teams';
import Handle_Get_Team_Members from './handle/Get_Team_Members';
import Handle_Get_Team_By_Id from './handle/Get_Team_By_Id';
import Handle_Get_Team_Leader from './handle/Get_Team_Leader';

dotenv.config();
const router_query_team: Router = express.Router();

const handle_get_teams = new Handle_Get_Teams();
const handle_get_team_members = new Handle_Get_Team_Members();
const handle_get_team_by_id = new Handle_Get_Team_By_Id();
const handle_get_team_leader = new Handle_Get_Team_Leader();

router_query_team.post('/get_teams', handle_get_teams.main);

router_query_team.post('/get_team_members', handle_get_team_members.main);

router_query_team.post('/get_team_by_id', handle_get_team_by_id.main);

router_query_team.post('/get_team_leader', handle_get_team_leader.main);

export default router_query_team;
