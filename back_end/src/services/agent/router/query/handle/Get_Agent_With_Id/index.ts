import { Request, Response } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Agent_Field } from '@src/dataStruct/agent';
import QueryDB_Get_Agent_With_Id from '../../queryDB/Get_Agent_With_Id';

class Handle_Get_Agent_With_Id {
    
    main = async (req: Request<any, any, any, { id: string }>, res: Response) => {
        const id = req.query.id;

        const my_response: My_Response_Field<Agent_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Agent_With_Id-main !',
        };

        const queryDB = new QueryDB_Get_Agent_With_Id();
        queryDB.set_Id(id);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy thông tin agent thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin agent KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin agent KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Agent_With_Id;
