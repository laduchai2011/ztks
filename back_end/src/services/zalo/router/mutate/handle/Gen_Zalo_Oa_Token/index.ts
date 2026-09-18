import axios from 'axios';
import qs from 'qs';
import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Gen_Zalo_Oa_Token_Result_Field } from '@src/data_struct/zalo';
import { Gen_Zalo_Oa_Token_Body_Field } from '@src/data_struct/zalo/body';

class Handle_Gen_Zalo_Oa_Token {
    main = async (req: Request<any, any, Gen_Zalo_Oa_Token_Body_Field>, res: Response) => {
        const gen_zalo_oa_token_body = req.body;

        const my_response: My_Response_Field<Gen_Zalo_Oa_Token_Result_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Gen_Zalo_Oa_Token-main)',
        };

        try {
            const body = qs.stringify({
                app_id: gen_zalo_oa_token_body.app_id,
                grant_type: 'authorization_code',
                code: gen_zalo_oa_token_body.code,
            });

            const result = await axios.post<Gen_Zalo_Oa_Token_Result_Field>(
                'https://oauth.zaloapp.com/v4/oa/access_token',
                body,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Secret_key: gen_zalo_oa_token_body.app_secret,
                    },
                }
            );
            const result_data = result.data;
            if (result_data) {
                my_response.data = result_data;
                my_response.is_success = true;
                my_response.message = 'Gen token zalo_oa thành công !';
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Gen token zalo_oa KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Gen token zaloOa KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Gen_Zalo_Oa_Token;
