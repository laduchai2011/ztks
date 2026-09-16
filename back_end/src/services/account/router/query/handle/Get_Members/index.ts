import { Request, Response } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Paged_Account_Field } from '@src/dataStruct/account';
import { Get_Members_Body_Field } from '@src/dataStruct/account/body';
import QueryDB_Get_Members from '../../queryDB/Get_Members';

class Handle_Get_Members {
   
    main = async (req: Request<any, any, Get_Members_Body_Field>, res: Response) => {
        const get_members_body = req.body;

        const my_response: My_Response_Field<Paged_Account_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Members-main)',
        };

        const queryDB = new QueryDB_Get_Members();
        queryDB.set_Get_Members_Body(get_members_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy những thành viên thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những thành viên KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những thành viên KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Members;
