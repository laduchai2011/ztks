import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { MyResponse } from '@src/dataStruct/response';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { OrderField } from '@src/dataStruct/order';
import { CreateOrderBodyField } from '@src/dataStruct/order/body';
import { verifyRefreshToken } from '@src/token';
import QueryDB_GetChatRoomWithId from '../../queryDB/GetChatRoomWithId';
import MutateDB_CreateOrder from '../../mutateDB/CreateOrder';
import { prefix_cache_chatRoom } from '@src/const/redisKey/chatRoom';

class Handle_CreateOrder {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    setup = async (
        req: Request<Record<string, never>, unknown, CreateOrderBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<OrderField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateOrder-setup)',
        };

        const createOrderBody = req.body;
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
            const newCreateOrderBody_cp = { ...createOrderBody };
            newCreateOrderBody_cp.accountId = id;
            res.locals.createOrderBody = newCreateOrderBody_cp;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    isChatRoom = async (_: Request, res: Response, next: NextFunction) => {
        const createOrderBody = res.locals.createOrderBody as CreateOrderBodyField;
        const accountId = createOrderBody.accountId;

        const myResponse: MyResponse<OrderField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateOrder-isChatRoom)',
        };

        // get in redis
        const chatRoomId = createOrderBody.chatRoomId;
        const keyRedis = `${prefix_cache_chatRoom.key.with_id}_${chatRoomId}`;
        const timeExpireat = prefix_cache_chatRoom.time;

        const chatRoom = await this._serviceRedis.getData<ChatRoomField>(keyRedis);
        if (chatRoom && chatRoom.accountId === accountId) {
            res.locals.zaloOaId = chatRoom.zaloOaId;
            next();
            return;
        }

        const queryDB = new QueryDB_GetChatRoomWithId();
        queryDB.setGetChatRoomWithIdBody({ id: chatRoomId });

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
                const r_chatRoom = result.recordset[0];

                // cache into redis
                const isSet = this._serviceRedis.setData<ChatRoomField>(keyRedis, r_chatRoom, timeExpireat);
                if (!isSet) {
                    console.error('Failed to lưu thông tin phòng hội thoại in Redis', keyRedis);
                }

                if (r_chatRoom.accountId === accountId) {
                    res.locals.zaloOaId = r_chatRoom.zaloOaId;
                    next();
                    return;
                }
                myResponse.message = 'Phòng chat này không phải của bạn !.';
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Phòng chat này không phải của bạn !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Phòng chat này không phải của bạn !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const createOrderBody = res.locals.createOrderBody as CreateOrderBodyField;
        const zaloOaId = res.locals.zaloOaId as number;

        const myResponse: MyResponse<OrderField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateOrder-main)',
        };

        const uuid = uuidv4();
        createOrderBody.uuid = uuid;
        createOrderBody.zaloOaId = zaloOaId;

        const mutateDB = new MutateDB_CreateOrder();
        mutateDB.setCreateOrderBody(createOrderBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await mutateDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];
                // produceTask<OrderField>('addOrder-to-provider', data);
                myResponse.message = 'Tạo đơn hàng thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Tạo đơn hàng KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Tạo đơn hàng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_CreateOrder;
