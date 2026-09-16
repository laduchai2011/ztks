import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Account_Field } from '@src/dataStruct/account';
import { Forget_Password_Body_Field } from '@src/dataStruct/account/body';
import MutateDB_Forget_Password from '../../mutateDB/Forget_Password';
import { prefix_cache__account } from '@src/const/redisKey/account';

class Handle_Forget_Password {

    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    main = async (req: Request<any, any, Forget_Password_Body_Field>, res: Response) => {
        const forget_password_body = req.body;

        const my_response: My_Response_Field<Account_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Forget_Password-main)',
        };

        const mutateDB = new MutateDB_Forget_Password();
        mutateDB.set_Forget_Password_Body(forget_password_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                const data = result;

                const keyDataRedis = `${prefix_cache__account.key.with_id}_${data.id}`;

                const isDel1 = this._serviceRedis.deleteData(keyDataRedis);
                if (!isDel1) {
                    console.error('Failed to delete key in Redis (Handle_ForgetPassword)', keyDataRedis);
                }

                my_response.message = 'Thay đổi mật khẩu thành công !';
                my_response.is_success = true;
                my_response.data = data;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Thay đổi mật khẩu KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Thay đổi mật khẩu KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Forget_Password;
