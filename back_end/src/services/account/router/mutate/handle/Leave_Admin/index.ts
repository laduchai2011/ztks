import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Leave_Admin_Body_Field } from '@src/data_struct/account/body';
import MutateDB_LeaveAdmin from '../../mutateDB/Leave_Admin';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Leave_Admin {
    setup = async (req: Request<any, any, Leave_Admin_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<boolean> = {
            is_success: false,
            message: 'Băt đầu (Handle_Leave_Admin-setup) !',
        };

        const leave_admin_body = req.body;
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
            leave_admin_body.account_id = id;
            res.locals.leave_admin_body = leave_admin_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const leave_admin_body = res.locals.leave_admin_body as Leave_Admin_Body_Field;

        const my_response: My_Response_Field<boolean> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Leave_Admin-main)',
        };

        const mutateDB = new MutateDB_LeaveAdmin();
        mutateDB.set_Leave_Admin_Body(leave_admin_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Rời admin thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Rời admin KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Rời admin KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Leave_Admin;
