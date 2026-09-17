import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Paged_Account_Field, Account_Field } from '@src/data_struct/account';
import { Get_Not_Reply_Account_Body_Field } from '@src/data_struct/account/body';
import QueryDB_Get_Not_Reply_Accounts from '../../queryDB/Get_Not_Reply_Accounts';
import { prefix_cache__not_reply_accounts } from '@src/const/redisKey/account';

class Handle_Get_Not_Reply_Accounts {
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    main = async (req: Request<any, any, Get_Not_Reply_Account_Body_Field>, res: Response) => {
        const get_not_reply_account_body = req.body;
        const chat_room_id = get_not_reply_account_body.chat_room_id;
        const page = get_not_reply_account_body.page;
        const size = get_not_reply_account_body.size;

        const my_response: My_Response_Field<Paged_Account_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Not_Reply_Accounts-main)',
        };

        const key_data_redis = `${prefix_cache__not_reply_accounts.key.with_chat_room_id}_${chat_room_id}_${page}_${size}`;
        const key_body_redis = `${prefix_cache__not_reply_accounts.key.with_chat_room_id}_${chat_room_id}`;
        const key_max_page_redis = `${prefix_cache__not_reply_accounts.key.max_page_with_chat_room_id}_${chat_room_id}`;
        const time_expireat = prefix_cache__not_reply_accounts.time;

        const not_reply_accounts_redis = await this._serviceRedis.getData<Paged_Account_Field>(key_data_redis);
        if (not_reply_accounts_redis) {
            my_response.data = not_reply_accounts_redis;
            my_response.message = 'Lấy danh sách người không trả lời tin nhắn thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        }

        const queryDB = new QueryDB_Get_Not_Reply_Accounts();
        queryDB.set_Get_Not_Reply_Account_Body(get_not_reply_account_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const rows: Account_Field[] = result.items;
                const rows_removed: Account_Field[] = [];
                for (let i: number = 0; i < rows.length; i++) {
                    const newRow = { ...rows[i] };
                    newRow.user_name = '';
                    newRow.password = '';
                    newRow.phone = '';
                    rows_removed.push(newRow);
                }
                const rData: Paged_Account_Field = { items: rows_removed, total_count: result.total_count };

                // cache with redis
                const is_set_data = await this._serviceRedis.setData<Paged_Account_Field>(
                    key_data_redis,
                    rData,
                    time_expireat
                );
                if (!is_set_data) {
                    console.error('Failed to set danh sách người không trả lời tin nhắn in Redis', key_data_redis);
                }
                const is_set_body = await this._serviceRedis.setData<Get_Not_Reply_Account_Body_Field>(
                    key_body_redis,
                    get_not_reply_account_body,
                    time_expireat
                );
                if (!is_set_body) {
                    this._serviceRedis.deleteData(key_data_redis);
                    console.error('Failed to set danh sách người không trả lời tin nhắn in Redis', key_body_redis);
                } else {
                    const max_page_redis = await this._serviceRedis.getData<number>(key_max_page_redis);
                    if ((max_page_redis && page > max_page_redis) || !max_page_redis) {
                        const is_set_max_page = await this._serviceRedis.setData<number>(
                            key_max_page_redis,
                            page,
                            time_expireat
                        );
                        if (!is_set_max_page) {
                            this._serviceRedis.deleteData(key_data_redis);
                        }
                    }
                }
                //------

                my_response.data = rData;
                my_response.message = 'Lấy danh sách người không trả lời tin nhắn thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy danh sách người không trả lời tin nhắn KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy danh sách người không trả lời tin nhắn KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Not_Reply_Accounts;
