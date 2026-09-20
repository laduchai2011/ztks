import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Zalo_App_Field, Playwight_Get_Zalo_App_Field } from '@src/data_struct/zalo';
import { Playwight_Get_Zalo_App_Body_Field } from '@src/data_struct/zalo/body';
import QueryDB_Playwight_Get_Zalo_App from '../../queryDB/Playwight_Get_Zalo_App';
import { SignOptions } from 'jsonwebtoken';
import { generate_Socket_Token, My_Jwt_Payload_Field } from '@src/token';

class Handle_Playwight_Get_Zalo_App {
    main = async (req: Request<any, any, Playwight_Get_Zalo_App_Body_Field>, res: Response) => {
        const playwight_get_zalo_app_body = req.body;

        const my_response: My_Response_Field<Playwight_Get_Zalo_App_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Playwight_Get_Zalo_App-main !',
        };

        const queryDB = new QueryDB_Playwight_Get_Zalo_App();
        queryDB.set_Playwight_Get_Zalo_App_Body(playwight_get_zalo_app_body);

        try {
            const result = await queryDB.run();

            if (result) {
                const zalo_app: Zalo_App_Field = { ...result };
                const my_jwt_payload: My_Jwt_Payload_Field = {
                    id: zalo_app.account_id,
                };
                const signOptions_socket_token: SignOptions = {
                    expiresIn: '1y',
                };
                const socket_token = generate_Socket_Token(my_jwt_payload, signOptions_socket_token);

                my_response.data = { zalo_app, token: socket_token };
                my_response.message = 'Lấy thông tin zalo_app thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin zaloApp KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin zaloApp KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Playwight_Get_Zalo_App;
