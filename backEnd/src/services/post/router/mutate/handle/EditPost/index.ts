import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { PostField } from '@src/dataStruct/post';
import { EditPostBodyField } from '@src/dataStruct/post/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_EditPost from '../../mutateDB/EditPost';
import { CacheGetPostWithId, CacheGetPosts } from '@src/const/redisKey/post';

class Handle_EditPost {
    private _mssql_server = mssql_server;
    private _cacheGetPostWithId = new CacheGetPostWithId();
    private _cacheGetPosts = new CacheGetPosts();

    constructor() {
        this._mssql_server.init();
        this._cacheGetPostWithId.init();
        this._cacheGetPosts.init();
    }

    setup = async (req: Request<any, any, EditPostBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<PostField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_EditPost-setup)',
        };

        const editPostBody = req.body;
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
            editPostBody.accountId = id;

            res.locals.editPostBody = editPostBody;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const editPostBody = res.locals.editPostBody as EditPostBodyField;
        this._cacheGetPostWithId.setBody({ id: editPostBody.id });

        const myResponse: MyResponse<PostField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_EditPost-main)',
        };

        const mutateDB = new MutateDB_EditPost();
        mutateDB.setEditPostBody(editPostBody);

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

                this._cacheGetPostWithId.clearCache();
                this._cacheGetPosts.setFK(data.registerPostId);
                this._cacheGetPosts.clearCache();

                myResponse.message = 'Tạo bài viết thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Tạo bài viết KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Tạo bài viết KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_EditPost;
