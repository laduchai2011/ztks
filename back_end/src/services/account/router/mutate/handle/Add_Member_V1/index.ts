import { Request, Response, NextFunction } from 'express';
import { verify_refresh_token } from '@src/token';
import MutateDB_Add_Member_V1 from '../../mutateDB/Add_Member_V1';
import { getRefreshToken } from '@src/device/getDevice';
import { My_Response_Field } from '@src/data_struct/response';
import { Account_Information_Field } from '@src/data_struct/account';
import { Add_Member_V1_Body_Field } from '@src/data_struct/account/body';

class Handle_Add_Member_V1 {
    setup = async (req: Request<any, any, Add_Member_V1_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Account_Information_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Add_Member_V1-setup)',
        };

        const add_member_v1_body = req.body;
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
            add_member_v1_body.added_by_id = id;
            res.locals.add_member_v1_body = add_member_v1_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const add_member_v1_body = res.locals.add_member_v1_body as Add_Member_V1_Body_Field;

        const my_response: My_Response_Field<Account_Information_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Add_Member_V1-main)',
        };

        const mutateDB = new MutateDB_Add_Member_V1();
        mutateDB.set_Add_Member_V1_Body_Field(add_member_v1_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Thêm thành viên thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Thêm thành viên KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Thêm thành viên KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Add_Member_V1;
