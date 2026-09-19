import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Paged_Zns_Template_Field } from '@src/data_struct/zalo';
import { Get_Zns_Templates_Body_Field } from '@src/data_struct/zalo/body';
import QueryDB_Get_Zns_Templates from '../../queryDB/Get_Zns_Templates';

class Handle_Get_Zns_Templates {
    main = async (req: Request<any, any, Get_Zns_Templates_Body_Field>, res: Response) => {
        const get_zns_templates_body = req.body;

        const my_response: My_Response_Field<Paged_Zns_Template_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Zns_Templates-main)',
        };

        const queryDB = new QueryDB_Get_Zns_Templates();
        queryDB.set_Get_Zns_Templates_Body(get_zns_templates_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy mẫu zns thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy mẫu zns KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy mẫu zns KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Zns_Templates;
