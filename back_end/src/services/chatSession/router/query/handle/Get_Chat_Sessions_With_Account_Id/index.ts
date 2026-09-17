import { Request, Response } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Paged_Chat_Session_Field, Chat_Session_Field } from '@src/datastruct/chat_session';
import { Chat_Session_With_Account_Id_Body_Field } from '@src/datastruct/chat_session/body';
import QueryDB_Get_Chat_Sessions_With_Account_Id from '../../queryDB/Get_Chat_Sessions_With_Account_Id';

class Handle_Get_Chat_Sessions_With_Account_Id {
    main = async (req: Request<any, any, Chat_Session_With_Account_Id_Body_Field>, res: Response) => {
        const chat_cession_with_account_id_body = req.body;

        const my_response: My_Response_Field<Paged_Chat_Session_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Chat_Sessions_With_Account_Id-main)',
        };

        const queryDB = new QueryDB_Get_Chat_Sessions_With_Account_Id();
        queryDB.set_Chat_Session_With_Account_Id_Body(chat_cession_with_account_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy phiên chat thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy phiên chat KHÔNG thành công 1 !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy phiên chat KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Chat_Sessions_With_Account_Id;
