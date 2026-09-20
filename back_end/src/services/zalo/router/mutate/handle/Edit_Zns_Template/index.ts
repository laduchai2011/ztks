import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Zns_Template_Field } from '@src/data_struct/zalo';
import { Edit_Zns_Template_Body_Field } from '@src/data_struct/zalo/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Edit_Zns_Template from '../../mutateDB/Edit_Zns_Template';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Edit_Zns_Template {
    setup = async (req: Request<any, any, Edit_Zns_Template_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Zns_Template_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Edit_Zns_Template-setup)',
        };

        const edit_zns_template_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_Refresh_Token(refreshToken);

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
            edit_zns_template_body.account_id = id;
            res.locals.edit_zns_template_body = edit_zns_template_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const edit_zns_template_body = res.locals.edit_zns_template_body as Edit_Zns_Template_Body_Field;

        const my_response: My_Response_Field<Zns_Template_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Edit_Zns_Template-main)',
        };

        const mutateDB = new MutateDB_Edit_Zns_Template();
        mutateDB.set_Edit_Zns_Template_Body(edit_zns_template_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Chỉnh sửa znsTemplate thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Chỉnh sửa znsTemplate KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Chỉnh sửa znsTemplate KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Edit_Zns_Template;
