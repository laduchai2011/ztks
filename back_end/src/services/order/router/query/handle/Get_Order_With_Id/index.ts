import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Order_Field } from '@src/data_struct/order';
import QueryDB_Get_Order_With_Id from '../../queryDB/Get_Order_With_Id';

class Handle_Get_Order_With_Id {
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    main = async (req: Request<any, any, any, { id: string }>, res: Response) => {
        const id = req.query.id;

        const my_response: My_Response_Field<Order_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Order_With_Id-main !',
        };

        const queryDB = new QueryDB_Get_Order_With_Id();
        queryDB.set_Get_Order_With_Id_Body({ id: id });

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy thông tin đơn hàng thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin đơn hàng KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin đơn hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Order_With_Id;
