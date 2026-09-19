import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_Get_Zalo_App_With_Account_Id from './handle/Get_Zalo_App_With_Account_Id';
import Handle_Get_Zalo_Oa_List_With_2_Fk from './handle/Get_Zalo_Oa_List_With_2_Fk';
import Handle_Get_Zalo_Oa_With_Id from './handle/Get_Zalo_Oa_With_Id';
import Handle_Get_Zalo_Oa_With_Oa_Id from './handle/Get_Zalo_Oa_With_Oa_Id';
import Handle_Get_Zalo_User_Infor from './handle/Get_Zalo_User_Infor';
import Handle_Playwight_Get_Zalo_App from './handle/Playwight_Get_Zalo_App';
import Handle_Get_Zalo_Oa_Token_With_Fk from './handle/Get_Zalo_Oa_Token_With_Fk';
import Handle_Get_Zns_Templates from './handle/Get_Zns_Templates';
import Handle_Get_Zns_Messages from './handle/Get_Zns_Messages';
import Handle_Get_Zns_Template_With_Id from './handle/Get_Zns_Template_With_Id';

const router_query_zalo: Router = express.Router();

const handle_get_zalo_app_with_account_id = new Handle_Get_Zalo_App_With_Account_Id();
const handle_get_zalo_oa_list_with_2_fk = new Handle_Get_Zalo_Oa_List_With_2_Fk();
const handle_get_zalo_oa_with_id = new Handle_Get_Zalo_Oa_With_Id();
const handle_get_zalo_oa_with_oa_id = new Handle_Get_Zalo_Oa_With_Oa_Id();
const handle_get_zalo_user_infor = new Handle_Get_Zalo_User_Infor();
const handle_playwight_get_zalo_app = new Handle_Playwight_Get_Zalo_App();
const handle_get_zalo_oa_token_with_fk = new Handle_Get_Zalo_Oa_Token_With_Fk();
const handle_get_zns_templates = new Handle_Get_Zns_Templates();
const handle_get_zns_messages = new Handle_Get_Zns_Messages();
const handle_get_zns_template_with_id = new Handle_Get_Zns_Template_With_Id();

router_query_zalo.post(
    '/get_zalo_app_with_account_id',
    authentication,
    handle_get_zalo_app_with_account_id.checkRole,
    handle_get_zalo_app_with_account_id.main
);

router_query_zalo.post(
    '/get_zalo_oa_list_with_2_fk',
    authentication,
    handle_get_zalo_oa_list_with_2_fk.check_Role,
    handle_get_zalo_oa_list_with_2_fk.main
);

router_query_zalo.post(
    '/get_zalo_oa_with_id',
    authentication,
    handle_get_zalo_oa_with_id.check_Role,
    handle_get_zalo_oa_with_id.main
);

router_query_zalo.post(
    '/get_zalo_oa_with_oa_id',
    authentication,
    handle_get_zalo_oa_with_oa_id.check_Role,
    handle_get_zalo_oa_with_oa_id.main
);

router_query_zalo.post(
    '/get_zalo_user_infor',
    authentication,
    handle_get_zalo_user_infor.get_Zalo_App,
    handle_get_zalo_user_infor.main
);

router_query_zalo.post('/playwight_get_zalo_app', handle_playwight_get_zalo_app.main);

router_query_zalo.post(
    '/get_zalo_oa_token_with_fk',
    handle_get_zalo_oa_token_with_fk.setup,
    handle_get_zalo_oa_token_with_fk.main
);

router_query_zalo.post('/get_zns_templates', handle_get_zns_templates.main);

router_query_zalo.post('/get_zns_messages', handle_get_zns_messages.main);

router_query_zalo.post(
    '/get_zns_template_with_id',
    handle_get_zns_template_with_id.setup,
    handle_get_zns_template_with_id.main
);

export default router_query_zalo;
