import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Statistics_Oa_Field } from '@src/data_struct/statistics';
import { Get_Statistics_Oa_Body_Field } from '@src/data_struct/statistics/body';
import QueryDB_Get_Statistics_Oa from '../../queryDB/Get_Statistics_Oa';

class Handle_Get_Statistics {
    main = async (req: Request<any, any, Get_Statistics_Oa_Body_Field>, res: Response) => {
        const get_statistics_oa_body = req.body;

        const my_response: My_Response_Field<Statistics_Oa_Field[]> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Statistics-main)',
        };

        const queryDB = new QueryDB_Get_Statistics_Oa();
        queryDB.set_Get_Statistics_Oa_Body(get_statistics_oa_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy thống kê thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thống kê KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thống kê KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Statistics;
