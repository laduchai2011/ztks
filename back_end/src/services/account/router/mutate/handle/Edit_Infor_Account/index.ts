import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Account_Field } from '@src/data_struct/account';
import { Edit_Infor_Account_Body_Field } from '@src/data_struct/account/body';
import { verify_refresh_token } from '@src/token';
import MutateDB_Edit_Infor_Account from '../../mutateDB/Edit_Infor_Account';
import { prefix_cache__account } from '@src/const/redisKey/account';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Edit_Infor_Account {
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    setup = async (req: Request<any, any, Edit_Infor_Account_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Account_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Edit_Infor_Account-setup)',
        };

        const edit_infor_account_body = req.body;
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
            edit_infor_account_body.id = id;
            res.locals.edit_infor_account_body = edit_infor_account_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const edit_infor_account_body = res.locals.edit_infor_account_body as Edit_Infor_Account_Body_Field;

        const my_response: My_Response_Field<Account_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Edit_Infor_Account-main)',
        };

        const mutateDB = new MutateDB_Edit_Infor_Account();
        mutateDB.set_Edit_Infor_Account_Body(edit_infor_account_body);

        const keyDataRedis = `${prefix_cache__account.key.with_id}_${edit_infor_account_body.id}`;

        try {
            const result = await mutateDB.run();
            if (result) {
                const isDel1 = this._serviceRedis.deleteData(keyDataRedis);
                if (!isDel1) {
                    console.error('Failed to delete key in Redis (Handle_EditInforAccount)', keyDataRedis);
                }

                my_response.message = 'Chỉnh sửa thông tin tài khoản thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Chỉnh sửa thông tin tài khoản KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Chỉnh sửa thông tin tài khoản KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Edit_Infor_Account;
