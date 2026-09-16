import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import QueryDB_Get_Account_Receive_Message from '../../queryDB/Get_Account_Receive_Message';
import { Account_Receive_Message_Field } from '@src/dataStruct/account';
import { Get_Account_Receive_Message_Body_Field } from '@src/dataStruct/account/body';
import { My_Response_Field } from '@src/dataStruct/response';
import { prefix_cache__account_receive_message } from '@src/const/redisKey/account';

class Handle_Get_Account_Receive_Message {
  
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    main = async (req: Request<any, any, Get_Account_Receive_Message_Body_Field>, res: Response) => {
        const get_account_receive_message_body = req.body;
        const account_id = get_account_receive_message_body.account_id;

        const my_response: My_Response_Field<Account_Receive_Message_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Account_Receive_Message-main)',
        };

        const key_redis = `${prefix_cache__account_receive_message.key.with_account_id}_${account_id}`;
        const time_expireat = prefix_cache__account_receive_message.time;

        const accountReceiveMessage_redis = await this._serviceRedis.getData<Account_Receive_Message_Field>(key_redis);
        if (accountReceiveMessage_redis) {
            my_response.data = accountReceiveMessage_redis;
            my_response.message = 'Lấy thông tin tài khoản nhận tin nhắn thành công !.';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        }

        const queryDB = new QueryDB_Get_Account_Receive_Message();
        queryDB.set_Get_Account_Receive_Message_Body(get_account_receive_message_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const rData = result;
                const isSet = await this._serviceRedis.setData<Account_Receive_Message_Field>(
                    key_redis,
                    rData,
                    time_expireat
                );
                if (!isSet) {
                    console.error('Failed to set thông tin tài khoản nhận tin nhắn in Redis', key_redis);
                }
                my_response.message = 'Lấy thông tin tài khoản nhận tin nhắn thành công !';
                my_response.is_success = true;
                my_response.data = rData;
                res.json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin tài khoản nhận tin nhắn KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin tài khoản nhận tin nhắn thất bại !!';
            my_response.err = error;
            res.status(200).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Account_Receive_Message;
