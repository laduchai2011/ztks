import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AccountInformationField } from '@src/dataStruct/account';
import { GetMyAccountInformationBodyField } from '@src/dataStruct/account/body';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { ZaloAppWithAccountIdBodyField, ZaloOaWithIdBodyField } from '@src/dataStruct/zalo/body';
import { AgentField } from '@src/dataStruct/agent';
import { GetAgentWithAgentAccountIdBodyField } from '@src/dataStruct/agent/body';
import { ChatRoomRoleField } from '@src/dataStruct/chatRoom';
import { ChatRoomRoleWithCridAaidBodyField } from '@src/dataStruct/chatRoom/body';
import { MessageAmountInDayField } from '@src/dataStruct/message_v1';
import { VideoMessageBodyField } from '@src/dataStruct/message_v1/body';
import QueryDB_GetMyAccountInformation from '../../queryDB/GetMyAccountInformation';
import QueryDB_GetZaloAppWithAccountId from '../../queryDB/GetZaloAppWithAccountId';
import QueryDB_GetZaloOaWithId from '../../queryDB/GetZaloOaWithId';
import QueryDB_GetAgentWithAgentAccountId from '../../queryDB/GetAgentWithAgentAccountId';
import QueryDB_GetChatRoomRoleWithCridAaid from '../../queryDB/GetChatRoomRoleWithCridAaid';
import { getMessageAmountInDay } from '../../queryMongo/GetMessageAmountInDay';
import { verifyRefreshToken } from '@src/token';
import { accountType_enum } from '@src/dataStruct/account';
import { prefix_cache_zaloApp, prefix_cache_zaloOa } from '@src/const/redisKey/zalo';
import { prefix_cache_accountInformation } from '@src/const/redisKey/account';
import { prefix_cache_agent } from '@src/const/redisKey/agent';
import { prefix_cache_chatRoomRole } from '@src/const/redisKey/chatRoom';
import { sendVideoMessage } from '@src/messageQueue/Producer';
import dotenv from 'dotenv';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';
const dev_prefix = isProduct ? '' : 'dev';

class Handle_VideoMessage {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    setup = async (req: Request<any, any, VideoMessageBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<any> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_VideoMessage-setup)',
        };

        const videoMessageBody: VideoMessageBodyField = req.body;

        const { refreshToken } = req.cookies;

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verifyRefreshToken(refreshToken);

            if (verify_refreshToken === 'invalid') {
                myResponse.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(myResponse);
                return;
            }

            if (verify_refreshToken === 'expired') {
                myResponse.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(myResponse);
                return;
            }

            const { id } = verify_refreshToken;
            videoMessageBody.accountId = id;
            res.locals.videoMessageBody = videoMessageBody;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    getMyAccountInformation = async (_: Request, res: Response, next: NextFunction) => {
        const videoMessageBody = res.locals.videoMessageBody as VideoMessageBodyField;

        const myResponse: MyResponse<AccountInformationField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_VideoMessage-getMyAccountInformation) !',
        };

        const getMyAccountInformationBody: GetMyAccountInformationBodyField = {
            accountId: videoMessageBody.accountId,
        };

        const keyRedis = `${prefix_cache_accountInformation.key.with_accountId}_${videoMessageBody.accountId}`;
        const timeExpireat = prefix_cache_accountInformation.time;

        const accountInformation_redis = await this._serviceRedis.getData<AccountInformationField>(keyRedis);
        if (accountInformation_redis) {
            res.locals.accountInformation = accountInformation_redis;
            next();
            return;
        }

        const queryDB = new QueryDB_GetMyAccountInformation();
        queryDB.setGetMyAccountInformationBody(getMyAccountInformationBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await queryDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const accountInformation: AccountInformationField = { ...result?.recordset[0] };

                const isSet = await this._serviceRedis.setData<AccountInformationField>(
                    keyRedis,
                    accountInformation,
                    timeExpireat
                );
                if (!isSet) {
                    console.error('Failed to set getMyAccountInformation in Redis', keyRedis);
                }

                res.locals.accountInformation = accountInformation;
                next();
                return;
            } else {
                myResponse.message = 'Lấy thông tin accountInformation KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin accountInformation KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };

    isHasAdmin = async (_: Request, res: Response, next: NextFunction) => {
        const accountInformation = res.locals.accountInformation as AccountInformationField;

        const myResponse: MyResponse<AccountInformationField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_VideoMessage-isAdmin) !',
        };

        const adminId = accountInformation.addedById;
        if (!adminId) {
            myResponse.message = 'Bạn chưa có admin nào';
            res.status(200).json(myResponse);
            return;
        }

        res.locals.adminId = adminId;
        next();
        return;
    };

    getZaloApp = async (_: Request, res: Response, next: NextFunction) => {
        const adminId = res.locals.adminId as number;
        const role = accountType_enum.MEMBER;

        const myResponse: MyResponse<ZaloAppField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetZaloAppWithAccountId-getZaloApp) !',
        };

        const keyRedis = `${prefix_cache_zaloApp.key.with_accountId}_${adminId}_${role}`;
        const timeExpireat = prefix_cache_zaloApp.time;

        const zaloApp_redis = await this._serviceRedis.getData<ZaloAppField>(keyRedis);
        if (zaloApp_redis) {
            res.locals.zaloApp = zaloApp_redis;
            next();
            return;
        }

        const zaloAppWithAccountIdBody: ZaloAppWithAccountIdBodyField = {
            role: role,
            accountId: adminId,
        };

        const queryDB = new QueryDB_GetZaloAppWithAccountId();
        queryDB.setZaloAppWithAccountIdBody(zaloAppWithAccountIdBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await queryDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const zaloApp: ZaloAppField = { ...result?.recordset[0] };

                const isSet = await this._serviceRedis.setData<ZaloAppField>(keyRedis, zaloApp, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set zaloApp in Redis', keyRedis);
                }

                res.locals.zaloApp = zaloApp;
                next();
                return;
            } else {
                myResponse.message = 'Lấy thông tin zaloApp KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin zaloApp KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };

    isPassZaloApp = async (req: Request<any, any, VideoMessageBodyField>, res: Response, next: NextFunction) => {
        const zaloApp = res.locals.zaloApp as ZaloAppField;
        const videoMessageBody: VideoMessageBodyField = req.body;

        const myResponse: MyResponse<AccountInformationField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_VideoMessage-isPassZaloApp) !',
        };

        if (videoMessageBody.zaloAppId === zaloApp.id) {
            next();
            return;
        }

        myResponse.message = 'Bạn không có quyền trên zaloApp này!';
        res.status(200).json(myResponse);
        return;
    };

    getZaloOa = async (req: Request<any, any, VideoMessageBodyField>, res: Response, next: NextFunction) => {
        const videoMessageBody: VideoMessageBodyField = req.body;
        const role = accountType_enum.MEMBER;
        const adminId = res.locals.adminId as number;

        const myResponse: MyResponse<ZaloOaField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetZaloAppWithAccountId-getZaloOa) !',
        };

        const keyRedis = `${prefix_cache_zaloOa.key.with_id}_${videoMessageBody.zaloOaId}_${role}`;
        const timeExpireat = prefix_cache_zaloOa.time;

        const zaloOa_redis = await this._serviceRedis.getData<ZaloOaField>(keyRedis);
        if (zaloOa_redis) {
            res.locals.zaloOa = zaloOa_redis;
            next();
            return;
        }

        const zaloOaWithIdBody: ZaloOaWithIdBodyField = {
            id: videoMessageBody.zaloOaId,
            accountId: adminId,
        };

        const queryDB = new QueryDB_GetZaloOaWithId();
        queryDB.setZaloOaWithIdBody(zaloOaWithIdBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await queryDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const zaloOa: ZaloOaField = { ...result?.recordset[0] };

                const isSet = await this._serviceRedis.setData<ZaloOaField>(keyRedis, zaloOa, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set zaloOa in Redis', keyRedis);
                }

                res.locals.zaloOa = zaloOa;
                next();
                return;
            } else {
                myResponse.message = 'Lấy thông tin zaloOa KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin zaloOa KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };

    isPassZaloOa = async (req: Request<any, any, VideoMessageBodyField>, res: Response, next: NextFunction) => {
        const zaloOa = res.locals.zaloOa as ZaloOaField;
        const videoMessageBody: VideoMessageBodyField = req.body;

        const myResponse: MyResponse<AccountInformationField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_VideoMessage-isPassZaloOa) !',
        };

        if (videoMessageBody.zaloOaId === zaloOa.id) {
            next();
            return;
        }

        myResponse.message = 'Bạn không có quyền trên zaloOa này!';
        res.status(200).json(myResponse);
        return;
    };

    getAgent = async (_: Request, res: Response, next: NextFunction) => {
        const videoMessageBody = res.locals.videoMessageBody as VideoMessageBodyField;

        const myResponse: MyResponse<AgentField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_VideoMessage-getAgent) !',
        };

        const getAgentWithAgentAccountIdBody: GetAgentWithAgentAccountIdBodyField = {
            agentAccountId: videoMessageBody.accountId,
        };

        const keyRedis = `${prefix_cache_agent.key.with_agentAccountId}_${getAgentWithAgentAccountIdBody.agentAccountId}`;
        const timeExpireat = prefix_cache_agent.time;

        const agent_redis = await this._serviceRedis.getData<AgentField>(keyRedis);
        if (agent_redis) {
            res.locals.agent = agent_redis;
            next();
            return;
        }

        const queryDB = new QueryDB_GetAgentWithAgentAccountId();
        queryDB.setGetAgentWithAgentAccountIdBody(getAgentWithAgentAccountIdBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await queryDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const agent: AgentField = { ...result?.recordset[0] };

                const isSet = await this._serviceRedis.setData<AgentField>(keyRedis, agent, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set agent in Redis', keyRedis);
                }

                res.locals.agent = agent;
                next();
                return;
            } else {
                myResponse.message = 'Lấy thông tin Agent KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin Agent KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };

    checkLimitMessage = async (_: Request, res: Response, next: NextFunction) => {
        const myId = res.locals.myId as number;
        const agent = res.locals.agent as AgentField;
        const type = agent.type;

        const myResponse: MyResponse<MessageAmountInDayField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetZaloAppWithAccountId-checkLimitMessage) !',
        };

        if (type !== 'basic') {
            next();
            return;
        }

        const data: MessageAmountInDayField | undefined = await getMessageAmountInDay(myId);
        if (!data) {
            myResponse.message = 'Lấy thông tin số lượng tin nhắn không thành công !';
            res.status(200).json(myResponse);
            return;
        }

        const messageAmount = data.amount;
        if (messageAmount < 30) {
            next();
            return;
        }

        myResponse.message = 'Gói cơ bản của bạn đã hết hạn mức, vui lòng nâng cấp !';
        res.status(200).json(myResponse);
        return;
    };

    getChatRoomRole = async (req: Request<any, any, VideoMessageBodyField>, res: Response, next: NextFunction) => {
        const videoMessageBody = res.locals.videoMessageBody as VideoMessageBodyField;

        const chatRoomRoleWithCridAaidBody: ChatRoomRoleWithCridAaidBodyField = {
            authorizedAccountId: videoMessageBody.accountId,
            chatRoomId: videoMessageBody.chatRoomId,
        };

        const myResponse: MyResponse<ChatRoomRoleField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_VideoMessage-getChatRoomRole)',
        };

        const keyRedis = `${prefix_cache_chatRoomRole.key.with_crid_Aaid}_${chatRoomRoleWithCridAaidBody.chatRoomId}_${chatRoomRoleWithCridAaidBody.authorizedAccountId}`;
        const timeExpireat = prefix_cache_chatRoomRole.time;

        const chatRoomRole_redis = await this._serviceRedis.getData<ChatRoomRoleField>(keyRedis);
        if (chatRoomRole_redis) {
            res.locals.chatRoomRole = chatRoomRole_redis;
            next();
            return;
        }

        const queryDB = new QueryDB_GetChatRoomRoleWithCridAaid();
        queryDB.setChatRoomRoleWithCridAaidBody(chatRoomRoleWithCridAaidBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await queryDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const rData = result.recordset[0];
                const isSet = await this._serviceRedis.setData<ChatRoomRoleField>(keyRedis, rData, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set thông tin quyền truy cập phòng hội thoại in Redis', keyRedis);
                }
                res.locals.chatRoomRole = rData;
                next();
                return;
            } else {
                myResponse.message = 'Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công 1 !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin quyền truy cập phòng hội thoại KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };

    isPassRoom = async (_: Request, res: Response, next: NextFunction) => {
        const chatRoomRole = res.locals.chatRoomRole as ChatRoomRoleField;

        const myResponse: MyResponse<ChatRoomRoleField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_VideoMessage-isPassRoom)',
        };

        const isSend = chatRoomRole.isSend;

        if (isSend) {
            next();
            return;
        } else {
            myResponse.message = 'Bạn không có quyền này !';
            res.status(200).json(myResponse);
            return;
        }
    };

    main = async (req: Request<any, any, VideoMessageBodyField>, res: Response) => {
        sendVideoMessage(`sendVideoMessage_${dev_prefix}`, req.body);

        const myResponse: MyResponse<any> = {
            isSuccess: true,
            message: 'Bắt đầu (Handle_VideoMessage-isPassRoom)',
        };

        myResponse.message = 'Bạn vừa gửi video !';
        res.status(200).json(myResponse);
        return;
    };
}

export default Handle_VideoMessage;
