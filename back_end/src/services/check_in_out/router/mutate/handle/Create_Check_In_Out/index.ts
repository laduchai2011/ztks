import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Check_In_Out_Field } from '@src/data_struct/check_in_out';
import { Create_Check_In_Out_Body_Field } from '@src/data_struct/check_in_out/body';
import { verify_refresh_token } from '@src/token';
import MutateDB_Create_Check_In_Out from '../../mutateDB/Create_Check_In_Out';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Check_In_Out {
    setup = async (req: Request<any, any, Create_Check_In_Out_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Check_In_Out_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Check_In_Out-setup)',
        };

        const create_check_in_out = req.body;
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
            create_check_in_out.account_id = id;
            res.locals.create_check_in_out = create_check_in_out;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_check_in_out = res.locals.create_check_in_out as Create_Check_In_Out_Body_Field;

        const my_response: My_Response_Field<Check_In_Out_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Check_In_Out-main)',
        };

        const mutateDB = new MutateDB_Create_Check_In_Out();
        mutateDB.set_Create_Check_In_Out_Body(create_check_in_out);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Tạo check-in/out thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo check-in/out KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo check-in/out KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Check_In_Out;
