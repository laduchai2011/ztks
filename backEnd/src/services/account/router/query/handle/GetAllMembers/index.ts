import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AccountField, AllMembersBodyField } from '@src/dataStruct/account';
import QueryDB_GetAllMembers from '../../queryDB/GetAllMembers';
import { verifyRefreshToken } from '@src/token';

class Handle_GetAllMembers {
    private _mssql_server = mssql_server;

    constructor() {}

    setup = (req: Request<any, any, AllMembersBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
        };

        const allMembersBody = req.body;
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
            const allMembersBody_cp = { ...allMembersBody };
            allMembersBody_cp.addedById = id;
            res.locals.allMembersBody = allMembersBody_cp;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        // const allMembersBody = res.locals.allMembersBody as AllMembersBodyField;
        const allMembersBody = { addedById: 1 } as AllMembersBodyField;

        const myResponse: MyResponse<AccountField[]> = {
            isSuccess: false,
        };

        await this._mssql_server.init();

        const queryDB_getAllMembers = new QueryDB_GetAllMembers();
        queryDB_getAllMembers.setAllMembersBody(allMembersBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB_getAllMembers.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await queryDB_getAllMembers.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                myResponse.data = result?.recordset;
                myResponse.message = 'Lấy tất cả thành viên thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy tất cả thành viên KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy tất cả thành viên KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetAllMembers;
