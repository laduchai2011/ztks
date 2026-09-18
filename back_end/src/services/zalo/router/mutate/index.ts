import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_Create_Zalo_Oa from './handle/Create_Zalo_Oa';
import Handle_Edit_Zalo_Oa from './handle/Edit_Zalo_Oa';
import Handle_Create_Zalo_Oa_Token from './handle/Create_Zalo_Oa_Token';
import Handle_Update_Refresh_Token_Of_Zalo_Oa from './handle/Update_Refresh_Token_Of_Zalo_Oa';
import Handle_Gen_Zalo_Oa_Token from './handle/Gen_Zalo_Oa_Token';
import Handle_Create_Zns_Template from './handle/Create_Zns_Template';
import Handle_Edit_Zns_Template from './handle/Edit_Zns_Template';
import Handle_Create_Zns_Message from './handle/Create_Zns_Message';

const router_mutate_zalo: Router = express.Router();

const handle_create_zalo_oa = new Handle_Create_Zalo_Oa();
const handle_edit_zalo_oa = new Handle_Edit_Zalo_Oa();
const handle_create_zalo_oa_token = new Handle_Create_Zalo_Oa_Token();
const handle_update_refresh_token_of_zalo_oa = new Handle_Update_Refresh_Token_Of_Zalo_Oa();
const handle_gen_zalo_oa_token = new Handle_Gen_Zalo_Oa_Token();
const handle_create_zns_template = new Handle_Create_Zns_Template();
const handle_edit_zns_template = new Handle_Edit_Zns_Template();
const handle_create_zns_message = new Handle_Create_Zns_Message();

router_mutate_zalo.post('/create_zalo_oa', authentication, handle_create_zalo_oa.setup, handle_create_zalo_oa.main);

router_mutate_zalo.patch('/edit_zalo_oa', authentication, handle_edit_zalo_oa.setup, handle_edit_zalo_oa.main);

router_mutate_zalo.post(
    '/create_zalo_oa_token',
    authentication,
    handle_create_zalo_oa_token.setup,
    handle_create_zalo_oa_token.main
);

router_mutate_zalo.patch(
    '/update_refresh_token_of_zalo_oa',
    authentication,
    handle_update_refresh_token_of_zalo_oa.setup,
    handle_update_refresh_token_of_zalo_oa.main
);

router_mutate_zalo.post('/gen_zalo_oa_token', authentication, handle_gen_zalo_oa_token.main);

router_mutate_zalo.post(
    '/create_zns_template',
    authentication,
    handle_create_zns_template.setup,
    handle_create_zns_template.main
);

router_mutate_zalo.patch(
    '/edit_zns_template',
    authentication,
    handle_edit_zns_template.setup,
    handle_edit_zns_template.main
);

router_mutate_zalo.post(
    '/create_zns_message',
    authentication,
    handle_create_zns_message.setup,
    handle_create_zns_message.main
);

export default router_mutate_zalo;
