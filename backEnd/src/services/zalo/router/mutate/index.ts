import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_CreateZaloOaToken from './handle/CreateZaloOaToken';
import Handle_UpdateRefreshTokenOfZaloOa from './handle/UpdateRefreshTokenOfZaloOa';

const router_mutate_zalo: Router = express.Router();

const handle_createZaloOaToken = new Handle_CreateZaloOaToken();
const handle_updateRefreshTokenOfZaloOa = new Handle_UpdateRefreshTokenOfZaloOa();

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

export default router_mutate_zalo;
