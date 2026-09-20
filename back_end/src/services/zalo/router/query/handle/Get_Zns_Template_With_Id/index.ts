import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Zns_Template_Field } from '@src/data_struct/zalo';
import { Get_Zns_Template_With_Id_Body_Field } from '@src/data_struct/zalo/body';
import QueryDB_Get_Zns_Template_With_Id from '../../queryDB/Get_Zns_Template_With_Id';
import { verify_Refresh_Token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_Zns_Template_With_Id {
    setup = (req: Request<any, any, Get_Zns_Template_With_Id_Body_Field>, res: Response, next: NextFunction) => {
        const get_zns_template_with_id_body = req.body;

        const my_response: My_Response_Field<Zns_Template_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Zns_Template_With_Id-setup !',
        };

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
            get_zns_template_with_id_body.account_id = id;
            res.locals.get_zns_template_with_id_body = get_zns_template_with_id_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const get_zns_template_with_id_body = res.locals
            .get_zns_template_with_id_body as Get_Zns_Template_With_Id_Body_Field;

        const my_response: My_Response_Field<Zns_Template_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Zns_Template_With_Id-main) !',
        };

        const queryDB = new QueryDB_Get_Zns_Template_With_Id();
        queryDB.set_Get_Zns_Template_With_Id_Body(get_zns_template_with_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy thông tin znsTemplate thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin znsTemplate KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin znsTemplate KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Zns_Template_With_Id;
