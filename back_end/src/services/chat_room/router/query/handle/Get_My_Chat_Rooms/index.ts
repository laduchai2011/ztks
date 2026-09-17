import { Request, Response } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Paged_Chat_Room_Field } from '@src/datastruct/chat_room';
import { Get_My_Chat_Rooms_Body_Field } from '@src/datastruct/chat_room/body';
import QueryDB_Get_My_Chat_Rooms from '../../queryDB/Get_My_Chat_Rooms';

class Handle_Get_My_Chat_Rooms {

    main = async (req: Request<any, any, Get_My_Chat_Rooms_Body_Field>, res: Response) => {
        const get_my_chat_rooms_body = req.body;

        const my_response: My_Response_Field<Paged_Chat_Room_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_My_Chat_Rooms-main)',
        };

        const queryDB = new QueryDB_Get_My_Chat_Rooms();
        queryDB.set_Get_My_Chat_Rooms_Body(get_my_chat_rooms_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy những phòng hội thoại thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những phòng hội thoại KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những phòng hội thoại KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_My_Chat_Rooms;
