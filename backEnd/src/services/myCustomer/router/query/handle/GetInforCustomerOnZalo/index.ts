import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ZaloCustomerField } from '@src/dataStruct/hookData';
import QueryZalo_GetInforCustomerOnZalo from '../../queryDB/GetInforCustomerOnZalo';

class Handle_GetInforCustomerOnZalo {
    constructor() {}

    main = async (req: Request<any, any, any, { customerId: string }>, res: Response) => {
        const customerId = req.query.customerId;

        const myResponse: MyResponse<ZaloCustomerField> = {
            isSuccess: false,
        };

        const queryZalo_getInforCustomerOnZalo = new QueryZalo_GetInforCustomerOnZalo();
        queryZalo_getInforCustomerOnZalo.setCustomerId(customerId);

        try {
            const result = await queryZalo_getInforCustomerOnZalo.run();
            if (result) {
                myResponse.data = result;
                myResponse.message = 'Lấy thông tin khách hàng trên ZALO thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin khách hàng trên ZALO KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin khách hàng trên ZALO KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetInforCustomerOnZalo;
