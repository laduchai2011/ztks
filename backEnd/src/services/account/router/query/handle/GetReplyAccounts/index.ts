import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { PagedAccountField, AccountField } from '@src/dataStruct/account';
import { GetReplyAccountBodyField } from '@src/dataStruct/account/body';
import QueryDB_GetReplyAccounts from '../../queryDB/GetReplyAccounts';
import { prefix_cache_replyAccounts } from '@src/const/redisKey/account';

class Handle_GetReplyAccounts {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    main = async (req: Request<Record<string, never>, unknown, GetReplyAccountBodyField>, res: Response) => {
        const getReplyAccountBody = req.body;
        const chatRoomId = getReplyAccountBody.chatRoomId;
        const page = getReplyAccountBody.page;
        const size = getReplyAccountBody.size;

        const myResponse: MyResponse<PagedAccountField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetReplyAccounts-main)',
        };

        const keyDataRedis = `${prefix_cache_replyAccounts.key.with_chatRoomId}_${chatRoomId}_${page}_${size}`;
        const keyBodyRedis = `${prefix_cache_replyAccounts.key.body_with_chatRoomId}_${chatRoomId}`;
        const keyMaxPageRedis = `${prefix_cache_replyAccounts.key.maxPage_with_chatRoomId}_${chatRoomId}`;
        const timeExpireat = prefix_cache_replyAccounts.time;

        const replyAccounts_redis = await this._serviceRedis.getData<PagedAccountField>(keyDataRedis);
        if (replyAccounts_redis) {
            myResponse.data = replyAccounts_redis;
            myResponse.message = 'Lấy danh sách người trả lời tin nhắn thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetReplyAccounts();
        queryDB.setGetReplyAccountBody(getReplyAccountBody);

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
            if (result?.recordset) {
                const rows: AccountField[] = result.recordset;
                const rows_removed: AccountField[] = [];
                for (let i: number = 0; i < rows.length; i++) {
                    const newRow = { ...rows[i] };
                    newRow.userName = '';
                    newRow.password = '';
                    newRow.phone = '';
                    rows_removed.push(newRow);
                }
                const rData = { items: rows_removed, totalCount: result.recordsets[1][0].totalCount };

                // cache with redis
                const isSetData = await this._serviceRedis.setData<PagedAccountField>(
                    keyDataRedis,
                    rData,
                    timeExpireat
                );
                if (!isSetData) {
                    console.error('Failed to set danh sách người trả lời tin nhắn in Redis', keyDataRedis);
                }
                const isSetBody = await this._serviceRedis.setData<GetReplyAccountBodyField>(
                    keyBodyRedis,
                    getReplyAccountBody,
                    timeExpireat
                );
                if (!isSetBody) {
                    this._serviceRedis.deleteData(keyDataRedis);
                    console.error('Failed to set danh sách người trả lời tin nhắn in Redis', keyBodyRedis);
                } else {
                    const maxPage_redis = await this._serviceRedis.getData<number>(keyMaxPageRedis);
                    if ((maxPage_redis && page > maxPage_redis) || !maxPage_redis) {
                        const isSetMaxPage = await this._serviceRedis.setData<number>(
                            keyMaxPageRedis,
                            page,
                            timeExpireat
                        );
                        if (!isSetMaxPage) {
                            this._serviceRedis.deleteData(keyDataRedis);
                        }
                    }
                }
                //------

                myResponse.data = rData;
                myResponse.message = 'Lấy danh sách người trả lời tin nhắn thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy danh sách người trả lời tin nhắn KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy danh sách người trả lời tin nhắn KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetReplyAccounts;
