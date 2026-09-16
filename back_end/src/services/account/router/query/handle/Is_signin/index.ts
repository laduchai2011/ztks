import { Request, Response } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { verify_refresh_token, is_Jwt_Payload } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Is_Signin {
    main = async (req: Request, res: Response) => {
        const my_response: My_Response_Field<string> = {
            is_success: false,
        };

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

            if (is_Jwt_Payload(verify_refreshToken) && verify_refreshToken.id) {
                my_response.data = verify_refreshToken.id;
                my_response.is_success = true;
                my_response.is_signin = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.is_signin = false;
                res.status(204).json(my_response);
                return;
            }
        } else {
            my_response.is_signin = false;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Is_Signin;
