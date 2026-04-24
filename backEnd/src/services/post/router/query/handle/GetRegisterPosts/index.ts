import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { RegisterPostField, PagedRegisterPostField } from '@src/dataStruct/post';
import { GetRegisterPostsBodyField } from '@src/dataStruct/post/body';
import QueryDB_GetRegisterPosts from '../../queryDB/GetRegisterPosts';
import { CacheGetRegisterPosts } from '@src/const/redisKey/post';

class Handle_GetRegisterPosts {
    private _mssql_server = mssql_server;
    private _cacheGetRegisterPosts = new CacheGetRegisterPosts();

    constructor() {
        this._mssql_server.init();
        this._cacheGetRegisterPosts.init();
    }

    main = async (req: Request<any, any, GetRegisterPostsBodyField>, res: Response) => {
        const getRegisterPostsBody = req.body;
        this._cacheGetRegisterPosts.setBody(getRegisterPostsBody);

        const myResponse: MyResponse<PagedRegisterPostField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetRegisterPosts-main)',
        };

        const paged_cache = await this._cacheGetRegisterPosts.getData();
        if (paged_cache) {
            myResponse.data = paged_cache;
            myResponse.message = 'Lấy những đăng ký bài đăng thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetRegisterPosts();
        queryDB.setGetRegisterPostsBody(getRegisterPostsBody);

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
                const rows: RegisterPostField[] = result.recordset;
                const paged: PagedRegisterPostField = { items: rows, totalCount: result.recordsets[1][0].totalCount };

                this._cacheGetRegisterPosts.setData(paged);

                myResponse.data = paged;
                myResponse.message = 'Lấy những đăng ký bài đăng thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy những đăng ký bài đăng KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy những đăng ký bài đăng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetRegisterPosts;
