import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { RegisterPostField } from '@src/dataStruct/post';
import { DeleteRegisterPostBodyField } from '@src/dataStruct/post/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_DeleteRegisterPost from '../../mutateDB/DeleteRegisterPost';
import { CacheGetRegisterPosts } from '@src/const/redisKey/post';

class Handle_DeleteRegisterPost {
    private _mssql_server = mssql_server;
    private _cacheGetRegisterPosts = new CacheGetRegisterPosts();

    constructor() {
        this._mssql_server.init();
        this._cacheGetRegisterPosts.init();
    }

    setup = async (req: Request<any, any, DeleteRegisterPostBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<RegisterPostField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_DeleteRegisterPost-setup)',
        };

        const deleteRegisterPostBody = req.body;
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
            deleteRegisterPostBody.accountId = id;

            res.locals.deleteRegisterPostBody = deleteRegisterPostBody;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const deleteRegisterPostBody = res.locals.deleteRegisterPostBody as DeleteRegisterPostBodyField;

        const myResponse: MyResponse<RegisterPostField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_DeleteRegisterPost-main)',
        };

        const mutateDB = new MutateDB_DeleteRegisterPost();
        mutateDB.setDeleteRegisterPostBody(deleteRegisterPostBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await mutateDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];

                this._cacheGetRegisterPosts.setFK(data.accountId);
                this._cacheGetRegisterPosts.clearCache();

                myResponse.message = 'Xóa đăng ký bài viết thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Xóa đăng ký bài viết KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Xóa đăng ký bài viết KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_DeleteRegisterPost;
