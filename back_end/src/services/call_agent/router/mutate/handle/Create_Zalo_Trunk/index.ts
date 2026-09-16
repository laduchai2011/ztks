import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import crypto from 'crypto';
import { Zalo_Trunk_Field } from '@src/dataStruct/call_agent';
import { Create_Zalo_Trunk_Body_Field } from '@src/dataStruct/call_agent/body';
import { verify_refresh_token } from '@src/token';
import MutateDB_Create_Zalo_Trunk from '../../mutateDB/Create_Zalo_Trunk';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Zalo_Trunk {

    setup = async (req: Request<any, any, Create_Zalo_Trunk_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Zalo_Trunk_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Zalo_Trunk-setup)',
        };

        const create_zalo_trunk_body = req.body;
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
            create_zalo_trunk_body.account_id = id;
            res.locals.create_zalo_trunk_body = create_zalo_trunk_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_zalo_trunk_body = res.locals.create_zalo_trunk_body as Create_Zalo_Trunk_Body_Field;

        const my_response: My_Response_Field<Zalo_Trunk_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Zalo_Trunk-main)',
        };

        const uuid = crypto.randomBytes(16).toString('hex');
        create_zalo_trunk_body.trunk_code = uuid;
        create_zalo_trunk_body.port = '5060';

        const mutateDB = new MutateDB_Create_Zalo_Trunk();
        mutateDB.set_Create_Zalo_Trunk_Body(create_zalo_trunk_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Tạo zalo-trunk thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo zalo-trunk KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo zalo-trunk KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Zalo_Trunk;
