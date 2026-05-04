import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_CreateZaloOa from './handle/CreateZaloOa';
import Handle_EditZaloOa from './handle/EditZaloOa';
import Handle_CreateZaloOaToken from './handle/CreateZaloOaToken';
import Handle_UpdateRefreshTokenOfZaloOa from './handle/UpdateRefreshTokenOfZaloOa';
import Handle_GenZaloOaToken from './handle/GenZaloOaToken';

const router_mutate_zalo: Router = express.Router();

const handle_createZaloOa = new Handle_CreateZaloOa();
const handle_editZaloOa = new Handle_EditZaloOa();
const handle_createZaloOaToken = new Handle_CreateZaloOaToken();
const handle_updateRefreshTokenOfZaloOa = new Handle_UpdateRefreshTokenOfZaloOa();
const handle_genZaloOaToken = new Handle_GenZaloOaToken();

router_mutate_zalo.post('/createZaloOa', authentication, handle_createZaloOa.setup, handle_createZaloOa.main);

router_mutate_zalo.patch('/editZaloOa', authentication, handle_editZaloOa.setup, handle_editZaloOa.main);

router_mutate_zalo.post(
    '/createZaloOaToken',
    authentication,
    handle_createZaloOaToken.setup,
    handle_createZaloOaToken.main
);

router_mutate_zalo.patch(
    '/updateRefreshTokenOfZaloOa',
    authentication,
    handle_updateRefreshTokenOfZaloOa.setup,
    handle_updateRefreshTokenOfZaloOa.main
);

router_mutate_zalo.post('/genZaloOaToken', authentication, handle_genZaloOaToken.main);

export default router_mutate_zalo;
