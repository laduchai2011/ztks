import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
// import { ChatRoomRoleField, ChatRoomRoleSchema } from '@src/dataStruct/chatRoom';
// import { UpdateSetupChatRoomRoleBodyField } from '@src/dataStruct/chatRoom/body';
import MutateDB_UpdateOrder from '../../mutateDB/UpdateOrder';
import QueryDB_GetMyOrderWithId from '../../queryDB/GetMyOrderWithId';
import { verifyRefreshToken } from '@src/token';
// import { prefix_cache_chatRoomRole } from '@src/const/redisKey/chatRoom';
// import { ChatRoomRoleZodSchema } from '@src/schema/chatRoom';
// import { ChatRoomRoleSchemaType } from '@src/schema/chatRoom';
// import { getDbMonggo } from '@src/connect/mongo';
import { GetMyOrderWithIdBodyField } from '@src/dataStruct/order/body';
import { OrderField } from '@src/dataStruct/order';
import { UpdateOrderBodyField } from '@src/dataStruct/order/body';

class Handle_UpdateOrder {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    setup = async (
        req: Request<Record<string, never>, unknown, UpdateOrderBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<OrderField> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_UpdateOrder-setup) !',
        };

        const updateOrderBody = req.body;
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
            const updateOrderBody_cp = { ...updateOrderBody };
            updateOrderBody_cp.accountId = id;
            res.locals.updateOrderBody = updateOrderBody_cp;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    isMyOrder = async (_: Request, res: Response, next: NextFunction) => {
        const updateOrderBody = res.locals.updateOrderBody as UpdateOrderBodyField;

        const myResponse: MyResponse<OrderField> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_UpdateOrder-isMyOrder) !',
        };

        const getMyOrderWithIdBody: GetMyOrderWithIdBodyField = {
            id: updateOrderBody.id,
            accountId: updateOrderBody.accountId,
        };

        const queryDB = new QueryDB_GetMyOrderWithId();
        queryDB.setGetMyOrderWithIdBody(getMyOrderWithIdBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await queryDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                next();
                return;
            } else {
                myResponse.message = 'Đơn hàng này bạn không có quyền chỉnh sửa !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            console.error(error);
            myResponse.message = 'Đơn hàng này bạn không có quyền chỉnh sửa !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const updateOrderBody = res.locals.updateOrderBody as UpdateOrderBodyField;

        const myResponse: MyResponse<OrderField> = {
            isSuccess: false,
            message: 'Băt đầu cập nhật (Handle_UpdateOrder-main) !',
        };

        const mutateDB = new MutateDB_UpdateOrder();
        mutateDB.setUpdateOrderBody(updateOrderBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await mutateDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const rData = result.recordset[0];
                myResponse.message = 'Cập nhật đơn hàng thành công !';
                myResponse.isSuccess = true;
                myResponse.data = rData;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Cập nhật đơn hàng KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            console.error(error);
            myResponse.message = 'Cập nhật đơn hàng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

// export async function getChatRoomRoleWithCridAaid(crid: number, aaid: number): Promise<ChatRoomRoleSchema | undefined> {
//     const db = getDbMonggo();
//     const col = db.collection<ChatRoomRoleSchema>('chatRoomRole');

//     const data = await col
//         .find<ChatRoomRoleSchema>({ authorized_account_id: aaid, chat_room_id: crid }, { projection: { _id: 0 } })
//         .sort({ timestamp: -1 })
//         .limit(1)
//         .toArray();

//     return data.length > 0 ? data[0] : undefined;
// }

// async function updateChatRoomRoleMongo(chatRoomRole: ChatRoomRoleField) {
//     const chatRommRoleSchema: ChatRoomRoleSchema = {
//         authorized_account_id: chatRoomRole.authorizedAccountId,
//         is_read: chatRoomRole.isRead,
//         is_send: chatRoomRole.isSend,
//         chat_room_id: chatRoomRole.chatRoomId,
//         zalo_oa_id: -1,
//         account_id: chatRoomRole.accountId,
//     };

//     const parsedChatRoomRole = ChatRoomRoleZodSchema.safeParse(chatRommRoleSchema);
//     if (!parsedChatRoomRole.success) {
//         console.error('Invalid chatRoomRole format:', parsedChatRoomRole.error);
//     } else {
//         const db = getDbMonggo();
//         const dataParse = parsedChatRoomRole.data;
//         const col = db.collection<ChatRoomRoleSchema>('chatRoomRole');

//         const { zalo_oa_id, ...doc } = dataParse as any;

//         const data = await col.updateOne(
//             {
//                 chat_room_id: chatRommRoleSchema.chat_room_id,
//                 authorized_account_id: chatRommRoleSchema.authorized_account_id,
//             },
//             { $set: doc },
//             { upsert: true }
//         );
//     }
// }

export default Handle_UpdateOrder;
