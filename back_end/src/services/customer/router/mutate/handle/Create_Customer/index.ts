import { Request, Response, NextFunction } from 'express';
import MutateDB_Create_Customer from '../../mutateDB/Create_Customer';
import { Customer_Field } from '@src/data_struct/customer';
import { Create_Customer_Body_Field } from '@src/data_struct/customer/body';
import { My_Response_Field } from '@src/data_struct/response';

class Handle_Create_Customer {
    is_Check_Phone = async (req: Request<any, any, Create_Customer_Body_Field>, res: Response, next: NextFunction) => {
        const create_customer_body = req.body;

        const my_response: My_Response_Field<Customer_Field> = {
            is_success: false,
            message: 'Handle_Create_Customer-isCheckPhone-begin',
        };

        const mutateDB = new MutateDB_Create_Customer();
        mutateDB.set_Create_Customer_Body(create_customer_body);

        const is = await mutateDB.is_Check_Phone(create_customer_body.phone);

        if (is) {
            my_response.message = 'Số điện thoại đã được sử dụng !';
            res.status(200).json(my_response);
            return;
        } else {
            next();
            return;
        }
    };

    main = async (req: Request<any, any, Create_Customer_Body_Field>, res: Response) => {
        const create_customer_body = req.body;

        const my_response: My_Response_Field<Customer_Field> = {
            is_success: false,
            message: 'Handle_Create_Customer-main-begin',
        };

        const mutateDB = new MutateDB_Create_Customer();

        try {
            mutateDB.set_Create_Customer_Body(create_customer_body);
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Đăng ký thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Đăng ký KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Đăng ký thất bại !';
            my_response.err = error;
            res.status(200).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Customer;
