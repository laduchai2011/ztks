import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Paged_Zns_Message_Field } from '@src/data_struct/zalo';
import { Get_Zns_Messages_Body_Field } from '@src/data_struct/zalo/body';
import QueryDB_Get_Zns_Messages from '../../queryDB/Get_Zns_Messages';

class Handle_Get_Zns_Messages {
    main = async (req: Request<any, any, Get_Zns_Messages_Body_Field>, res: Response) => {
        const get_zns_messages_body = req.body;

        const my_response: My_Response_Field<Paged_Zns_Message_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Zns_Messages-main)',
        };

        const queryDB = new QueryDB_Get_Zns_Messages();
        queryDB.set_Get_Zns_Messages_Body(get_zns_messages_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy tin znsMessage thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy tin znsMessage KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy tin znsMessage KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Zns_Messages;
