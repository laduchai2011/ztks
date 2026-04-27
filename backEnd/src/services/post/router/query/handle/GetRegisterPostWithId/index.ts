import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { RegisterPostField } from '@src/dataStruct/post';
import { GetRegisterPostWithIdBodyField } from '@src/dataStruct/post/body';
import QueryDB_GetRegisterPostWithId from '../../queryDB/GetRegisterPostWithId';
import { CacheGetRegisterPostWithId } from '@src/const/redisKey/post';

class Handle_GetRegisterPostWithId {
    private _mssql_server = mssql_server;
    private _cacheGetRegisterPostWithId = new CacheGetRegisterPostWithId();

    constructor() {
        this._mssql_server.init();
        this._cacheGetRegisterPostWithId.init();
    }

    main = async (req: Request<any, any, GetRegisterPostWithIdBodyField>, res: Response) => {
        const getRegisterPostWithIdBody = req.body;
        this._cacheGetRegisterPostWithId.setBody(getRegisterPostWithIdBody);

        const myResponse: MyResponse<RegisterPostField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetPostWithId-main) !',
        };

        const registerPost_cache = await this._cacheGetRegisterPostWithId.getData();
        if (registerPost_cache) {
            myResponse.data = registerPost_cache;
            myResponse.message = 'Lấy đăng ký bài đăng thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetRegisterPostWithId();
        queryDB.setGetRegisterPostWithIdBody(getRegisterPostWithIdBody);

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
                const post: RegisterPostField = { ...result?.recordset[0] };

                this._cacheGetRegisterPostWithId.setData(post);

                myResponse.data = post;
                myResponse.message = 'Lấy đăng ký bài đăng thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy đăng ký bài đăng KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy đăng ký bài đăng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetRegisterPostWithId;
