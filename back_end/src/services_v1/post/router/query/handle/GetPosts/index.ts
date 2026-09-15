import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { PostField, PagedPostField } from '@src/dataStruct/post';
import { GetPostsBodyField } from '@src/dataStruct/post/body';
import QueryDB_GetPosts from '../../queryDB/GetPosts';
import { CacheGetPosts } from '@src/const/redisKey/post';

class Handle_GetPosts {
    private _mssql_server = mssql_server;
    private _cacheGetPosts = new CacheGetPosts();

    constructor() {
        this._mssql_server.init();
        this._cacheGetPosts.init();
    }

    main = async (req: Request<any, any, GetPostsBodyField>, res: Response) => {
        const getPostsBody = req.body;
        this._cacheGetPosts.setBody(getPostsBody);
        this._cacheGetPosts.setFK(getPostsBody.registerPostId);

        const myResponse: MyResponse<PagedPostField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetPosts-main)',
        };

        const paged_cache = await this._cacheGetPosts.getData();
        if (paged_cache) {
            myResponse.data = paged_cache;
            myResponse.message = 'Lấy những bài đăng thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetPosts();
        queryDB.setGetPostsBody(getPostsBody);

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
            if (result?.recordset) {
                const rows: PostField[] = result.recordset;
                const paged: PagedPostField = { items: rows, totalCount: result.recordsets[1][0].totalCount };

                this._cacheGetPosts.setData(paged);

                myResponse.data = paged;
                myResponse.message = 'Lấy những bài đăng thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy những bài đăng KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy những bài đăng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetPosts;
