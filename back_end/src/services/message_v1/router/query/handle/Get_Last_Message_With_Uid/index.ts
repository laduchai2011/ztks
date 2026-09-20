import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import { Zalo_Message_Type } from '@src/data_struct/zalo/hook_data';
import { get_Last_Message_With_Uid } from '../../queryMongo/Get_Last_Message';

class Handle_Get_Last_Message_With_Uid {
    main = async (req: Request<any, any, any, { uid: string }>, res: Response) => {
        const uid = req.query.uid;

        const my_response: My_Response_Field<Message_V1_Field<Zalo_Message_Type>> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Last_Message_With_Uid-main)',
        };

        const result = await get_Last_Message_With_Uid(uid);

        if (result) {
            my_response.data = result;
            my_response.message = 'Lấy tin nhắn cuối cùng thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        } else {
            my_response.message = 'Lấy tin nhắn cuối cùng KHÔNG thành công !';
            res.status(200).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Last_Message_With_Uid;
