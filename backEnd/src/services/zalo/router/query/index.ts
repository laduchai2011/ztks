import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_GetZaloAppWithAccountId from './handle/GetZaloAppWithAccountId';
import Handle_GetZaloOaListWith2Fk from './handle/GetZaloOaListWith2Fk';
import Handle_GetZaloOaWithId from './handle/GetZaloOaWithId';
import Handle_GetZaloUserInfor from './handle/GetZaloUserInfor';
import Handle_PlaywightGetZaloApp from './handle/PlaywightGetZaloApp';
import Handle_GetZaloOaTokenWithFk from './handle/GetZaloOaTokenWithFk';
import Handle_GetZnsTemplates from './handle/GetZnsTemplates';
import Handle_GetZnsMessages from './handle/GetZnsMessages';

const router_query_zalo: Router = express.Router();

const handle_getZaloAppWithAccountId = new Handle_GetZaloAppWithAccountId();
const handle_getZaloOaListWith2Fk = new Handle_GetZaloOaListWith2Fk();
const handle_getZaloOaWithId = new Handle_GetZaloOaWithId();
const handle_getZaloUserInfor = new Handle_GetZaloUserInfor();
const handle_playwightGetZaloApp = new Handle_PlaywightGetZaloApp();
const handle_getZaloOaTokenWithFk = new Handle_GetZaloOaTokenWithFk();
const handle_getZnsTemplates = new Handle_GetZnsTemplates();
const handle_getZnsMessages = new Handle_GetZnsMessages();

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

router_query_zalo.post('/playwightGetZaloApp', handle_playwightGetZaloApp.main);

router_query_zalo.post('/getZaloOaTokenWithFk', handle_getZaloOaTokenWithFk.setup, handle_getZaloOaTokenWithFk.main);

router_query_zalo.post('/getZnsTemplates', handle_getZnsTemplates.main);

router_query_zalo.post('/getZnsMessages', handle_getZnsMessages.main);

export default router_query_zalo;
