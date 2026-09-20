import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Zalo_Oa_Token_Field } from '@src/data_struct/zalo';
import { Get_Zalo_Oa_Token_With_Fk_Body_Field } from '@src/data_struct/zalo/body';
import QueryDB_Get_Zalo_Oa_Token_With_Fk from '../../queryDB/Get_Zalo_Oa_Token_With_Fk';
import { verify_Refresh_Token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_Zalo_Oa_Token_With_Fk {
    setup = (req: Request<any, any, Get_Zalo_Oa_Token_With_Fk_Body_Field>, res: Response, next: NextFunction) => {
        const get_zalo_oa_token_with_fk_body: Get_Zalo_Oa_Token_With_Fk_Body_Field = req.body;

        const my_response: My_Response_Field<Zalo_Oa_Token_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Zalo_Oa_Token_With_Fk-setup !',
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
            get_zalo_oa_token_with_fk_body.account_id = id;
            res.locals.get_zalo_oa_token_with_fk_body = get_zalo_oa_token_with_fk_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const get_zalo_oa_token_with_fk_body = res.locals
            .get_zalo_oa_token_with_fk_body as Get_Zalo_Oa_Token_With_Fk_Body_Field;

        const my_response: My_Response_Field<Zalo_Oa_Token_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Zalo_Oa_Token_With_Fk-main !',
        };

        const queryDB = new QueryDB_Get_Zalo_Oa_Token_With_Fk();
        queryDB.set_Get_Zalo_Oa_Token_With_Fk_Body(get_zalo_oa_token_with_fk_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy token zalo oa thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy token zalo oa KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy token zalo oa KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Zalo_Oa_Token_With_Fk;
