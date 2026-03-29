import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_GetZaloAppWithAccountId from './handle/GetZaloAppWithAccountId';
import Handle_GetZaloOaListWith2Fk from './handle/GetZaloOaListWith2Fk';
import Handle_GetZaloOaWithId from './handle/GetZaloOaWithId';
import Handle_GetZaloUserInfor from './handle/GetZaloUserInfor';

const router_query_zalo: Router = express.Router();

const handle_getZaloAppWithAccountId = new Handle_GetZaloAppWithAccountId();
const handle_getZaloOaListWith2Fk = new Handle_GetZaloOaListWith2Fk();
const handle_getZaloOaWithId = new Handle_GetZaloOaWithId();
const handle_getZaloUserInfor = new Handle_GetZaloUserInfor();

router_query_zalo.post(
    '/getZaloAppWithAccountId',
    authentication,
    handle_getZaloAppWithAccountId.checkRole,
    handle_getZaloAppWithAccountId.main
);

router_query_zalo.post(
    '/getZaloOaListWith2Fk',
    authentication,
    handle_getZaloOaListWith2Fk.checkRole,
    handle_getZaloOaListWith2Fk.main
);

router_query_zalo.post(
    '/getZaloOaWithId',
    authentication,
    handle_getZaloOaWithId.checkRole,
    handle_getZaloOaWithId.main
);

router_query_zalo.post(
    '/getZaloUserInfor',
    authentication,
    handle_getZaloUserInfor.getZaloApp,
    handle_getZaloUserInfor.main
);

export default router_query_zalo;
