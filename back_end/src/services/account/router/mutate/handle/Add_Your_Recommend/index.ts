import { Request, Response, NextFunction } from 'express';
import MutateDB_Add_Your_Recommend from '../../mutateDB/Add_Your_Recommend';
import { Recommend_Field } from '@src/data_struct/account';
import { Add_Your_Recommend_Body_Field } from '@src/data_struct/account/body';
import { My_Response_Field } from '@src/data_struct/response';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Add_Your_Recommend {
    setup = async (req: Request<any, any, Add_Your_Recommend_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Recommend_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_AddYourRecommend-setup)',
        };

        const add_your_recommend_body = req.body;
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
            add_your_recommend_body.account_id = id;
            res.locals.add_your_recommend_body = add_your_recommend_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const add_your_recommend_body = res.locals.add_your_recommend_body as Add_Your_Recommend_Body_Field;

        const my_response: My_Response_Field<Recommend_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Add_Your_Recommend-main)',
        };

        const mutateDB = new MutateDB_Add_Your_Recommend();
        mutateDB.setA_Add_Your_Recommend_Body(add_your_recommend_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Thêm mã giới thiệu thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.json(my_response);
                return;
            } else {
                my_response.message = 'Thêm mã giới thiệu KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Thêm mã giới thiệu thất bại !';
            my_response.err = error;
            res.status(200).json(my_response);
            return;
        }
    };
}

export default Handle_Add_Your_Recommend;
