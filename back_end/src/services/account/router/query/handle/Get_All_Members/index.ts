import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Account_Field, All_Members_Body_Field } from '@src/dataStruct/account';
import QueryDB_Get_All_Members from '../../queryDB/Get_All_Members';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_All_Members {

    setup = (req: Request<any, any, All_Members_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Account_Field> = {
            is_success: false,
        };

        const all_members_body = req.body;
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
            all_members_body.added_by_id = id;
            res.locals.all_members_body = all_members_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const all_members_body = res.locals.all_members_body as All_Members_Body_Field;

        const my_response: My_Response_Field<Account_Field[]> = {
            is_success: false,
        };

        const queryDB = new QueryDB_Get_All_Members();
        queryDB.set_All_Members_Body(all_members_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy tất cả thành viên thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy tất cả thành viên KHÔNG thành công 1 !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy tất cả thành viên KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_All_Members;
