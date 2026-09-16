import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Get_Agent_With_Id from './handle/Get_Agent_With_Id';
import Handle_Get_Agent_With_Agent_Account_Id from './handle/Get_Agent_With_Agent_Account_Id';
import Handle_Get_Agents from './handle/Get_Agents';
import Handle_Get_Last_Agent_Pay from './handle/Get_Last_Agent_Pay';

dotenv.config();
const router_query_agent: Router = express.Router();

const handle_get_agent_with_id = new Handle_Get_Agent_With_Id();
const handle_get_agent_with_agent_account_id = new Handle_Get_Agent_With_Agent_Account_Id();
const handle_get_agents = new Handle_Get_Agents();
const handle_get_last_agent_pay = new Handle_Get_Last_Agent_Pay();

router_query_agent.get('/get_agent_with_id', authentication, handle_get_agent_with_id.main);

router_query_agent.post('/get_agent_with_agent_account_id', authentication, handle_get_agent_with_agent_account_id.main);

router_query_agent.post('/get_agents', authentication, handle_get_agents.setup, handle_get_agents.main);

router_query_agent.post('/get_last_agent_pay', authentication, handle_get_last_agent_pay.setup, handle_get_last_agent_pay.main);

export default router_query_agent;
