import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Account_Receive_Message_Field } from '@src/dataStruct/account';
import { Update_Account_Receive_Message_Body_Field } from '@src/dataStruct/account/body';
import { verify_refresh_token } from '@src/token';
import MutateDB_Update_Account_Receive_Message from '../../mutateDB/Update_Account_Receive_Message';
import { prefix_cache__account_receive_message } from '@src/const/redisKey/account';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Update_Account_Receive_Message {
   
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    setup = async (
        req: Request<any, any, Update_Account_Receive_Message_Body_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const my_response: My_Response_Field<Account_Receive_Message_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Update_Account_Receive_Message-setup)',
        };

        const update_account_receive_message_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_refresh_token(refreshToken);

            if (verify_refreshToken === 'invalid') {
                my_response.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            if (verify_refreshToken === 'expired') {
                my_response.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            const { id } = verify_refreshToken;
            update_account_receive_message_body.account_id = id;
            res.locals.update_account_receive_message_body = update_account_receive_message_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const update_account_receive_message_body = res.locals
            .update_account_receive_message_body as Update_Account_Receive_Message_Body_Field;
        const account_id = update_account_receive_message_body.account_id;

        const my_response: My_Response_Field<Account_Receive_Message_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Update_Account_Receive_Message-main)',
        };

        const mutateDB = new MutateDB_Update_Account_Receive_Message();
        mutateDB.set_Update_Account_Receive_Message_Body(update_account_receive_message_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                const keyRedis = `${prefix_cache__account_receive_message.key.with_account_id}_${account_id}`;
                const isDel = this._serviceRedis.deleteData(keyRedis);
                if (!isDel) {
                    console.error('Failed to delete key in Redis', keyRedis);
                }

                my_response.message = 'Thiết lập tài khoản nhận tin nhắn thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Thiết lập tài khoản nhận tin nhắn KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Thiết lập tài khoản nhận tin nhắn KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Update_Account_Receive_Message;
