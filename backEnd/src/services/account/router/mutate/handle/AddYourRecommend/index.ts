import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import MutateDB_AddYourRecommend from '../../mutateDB/AddYourRecommend';
import { RecommendField } from '@src/dataStruct/account';
import { AddYourRecommendBodyField } from '@src/dataStruct/account/body';
import { MyResponse } from '@src/dataStruct/response';
import { verifyRefreshToken } from '@src/token';

class Handle_AddYourRecommend {
    private _mssql_server = mssql_server;

    constructor() {}

    setup = async (req: Request<any, any, AddYourRecommendBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<RecommendField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_AddYourRecommend-setup)',
        };

        const addYourRecommendBody = req.body;
        const { refreshToken } = req.cookies;

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
            const addYourRecommendBody_cp = { ...addYourRecommendBody };
            addYourRecommendBody_cp.accountId = id;
            res.locals.addYourRecommendBody = addYourRecommendBody_cp;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const addYourRecommendBody = res.locals.addYourRecommendBody as AddYourRecommendBodyField;

        const myResponse: MyResponse<RecommendField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_AddYourRecommend-main)',
        };

        await this._mssql_server.init();

        const mutateDB_addMember = new MutateDB_AddYourRecommend();
        const connection_pool = this._mssql_server.get_connectionPool();
        mutateDB_addMember.setAddYourRecommendBody(addYourRecommendBody);
        if (connection_pool) {
            mutateDB_addMember.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu KHÔNG thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await mutateDB_addMember.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                myResponse.message = 'Thêm mã giới thiệu thành công !';
                myResponse.isSuccess = true;
                myResponse.data = result?.recordset[0];
                res.json(myResponse);
            } else {
                myResponse.message = 'Thêm mã giới thiệu KHÔNG thành công !';
                res.status(200).json(myResponse);
            }
        } catch (error) {
            myResponse.message = 'Thêm mã giới thiệu thất bại !';
            myResponse.err = error;
            res.status(200).json(myResponse);
        }
    };
}

export default Handle_AddYourRecommend;
