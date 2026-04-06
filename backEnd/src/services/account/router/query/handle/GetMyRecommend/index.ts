import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { RecommendField } from '@src/dataStruct/account';
import { GetMyRecommendBodyField } from '@src/dataStruct/account/body';
import QueryDB_GetMyRecommend from '../../queryDB/GetMyRecommend';
import { verifyRefreshToken } from '@src/token';

class Handle_GetMyRecommend {
    private _mssql_server = mssql_server;

    constructor() {}

    setup = (req: Request<any, any, GetMyRecommendBodyField>, res: Response, next: NextFunction) => {
        const getMyRecommendBody = req.body;

        const myResponse: MyResponse<RecommendField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetMyRecommend-setup !',
        };

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

            const getMyRecommendBody_cp = { ...getMyRecommendBody };
            getMyRecommendBody_cp.accountId = id;
            res.locals.getMyRecommendBody = getMyRecommendBody_cp;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const getMyRecommendBody = res.locals.getMyRecommendBody as GetMyRecommendBodyField;

        const myResponse: MyResponse<RecommendField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetMyRecommend-main !',
        };

        await this._mssql_server.init();

        const queryDB = new QueryDB_GetMyRecommend();
        queryDB.setGetMyRecommendBody(getMyRecommendBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await queryDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const recommend: RecommendField = { ...result?.recordset[0] };
                myResponse.data = recommend;
                myResponse.message = 'Lấy thông tin giới thiệu thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin giới thiệu KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin giới thiệu KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetMyRecommend;
