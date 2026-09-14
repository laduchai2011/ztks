import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { PostField } from '@src/dataStruct/post';
import { GetPostWithIdBodyField } from '@src/dataStruct/post/body';
import QueryDB_GetPostWithId from '../../queryDB/GetPostWithId';
import { CacheGetPostWithId } from '@src/const/redisKey/post';

class Handle_GetPostWithId {
    private _mssql_server = mssql_server;
    private _cacheGetPostWithId = new CacheGetPostWithId();

    constructor() {
        this._mssql_server.init();
        this._cacheGetPostWithId.init();
    }

    main = async (req: Request<any, any, GetPostWithIdBodyField>, res: Response) => {
        const getPostWithIdBody = req.body;
        this._cacheGetPostWithId.setBody(getPostWithIdBody);

        const myResponse: MyResponse<PostField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetPostWithId-main) !',
        };

        const post_cache = await this._cacheGetPostWithId.getData();
        if (post_cache) {
            myResponse.data = post_cache;
            myResponse.message = 'Lấy bài đăng thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetPostWithId();
        queryDB.setGetPostWithIdBody(getPostWithIdBody);

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
                const post: PostField = { ...result?.recordset[0] };

                this._cacheGetPostWithId.setData(post);

                myResponse.data = post;
                myResponse.message = 'Lấy bài đăng thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy bài đăng KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy bài đăng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetPostWithId;
