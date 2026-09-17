import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/data_struct/response';
import { Shop_Field } from '@src/data_struct/shop';
import { Create_Shop_Body_Field } from '@src/data_struct/shop/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_Create_Shop from '../../mutateDB/Create_Shop';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Shop {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, Create_Shop_Body_Field>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<Shop_Field> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_Create_Shop-setup)',
        };

        const create_shop_body = req.body;
        // const { refreshToken } = req.cookies;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verifyRefreshToken(refreshToken);

            if (verify_refreshToken === 'invalid') {
                myResponse.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(myResponse);
                return;
            }

            if (verify_refreshToken === 'expired') {
                myResponse.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(myResponse);
                return;
            }

            const { id } = verify_refreshToken;
            create_shop_body.p_account_id = id;

            res.locals.create_shop_body = create_shop_body;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_shop_body = res.locals.create_shop_body as Create_Shop_Body_Field;

        const myResponse: MyResponse<Shop_Field> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_Create_Shop-main)',
        };

        const mutateDB = new MutateDB_Create_Shop();
        mutateDB.set_Create_Shop_Body(create_shop_body);

        try {
            const result = await mutateDB.run();
        } catch (error) {
            myResponse.message = 'Tạo cửa hàng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_Create_Shop;
