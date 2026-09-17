import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Account_Field } from '@src/data_struct/account';
import QueryDB_Get_Account_With_Id from '../../queryDB/Get_Account_With_Id';
import { prefix_cache__account } from '@src/const/redisKey/account';

class Handle_Get_Account_With_Id {
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    main = async (req: Request<any, any, any, { id: string }>, res: Response) => {
        const id = req.query.id;

        const my_response: My_Response_Field<Account_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Account_With_Id !',
        };

        const key_data_redis = `${prefix_cache__account.key.with_id}_${id}`;
        const time_expireat = prefix_cache__account.time;
        const account_redis = await this._serviceRedis.getData<Account_Field>(key_data_redis);
        if (account_redis) {
            my_response.data = account_redis;
            my_response.message = 'Lấy thông tin tài khoản thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        }

        const queryDB = new QueryDB_Get_Account_With_Id();
        queryDB.set_Account_Id(id);

        try {
            const result = await queryDB.run();
            if (result) {
                const account: Account_Field = { ...result };
                account.user_name = '';
                account.password = '';
                account.phone = '';

                const is_set_data = await this._serviceRedis.setData<Account_Field>(
                    key_data_redis,
                    account,
                    time_expireat
                );
                if (!is_set_data) {
                    console.error('Failed to set thông tin tài khoản in Redis', key_data_redis);
                }

                my_response.data = account;
                my_response.message = 'Lấy thông tin tài khoản thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin tài khoản KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin tài khoản KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Account_With_Id;
