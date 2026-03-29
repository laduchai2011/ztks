import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { verifyRefreshToken } from '@src/token';
import { ZaloOaField, PagedZaloOaField } from '@src/dataStruct/zalo';
import { ZaloOaListWith2FkBodyField } from '@src/dataStruct/zalo/body';
import QueryDB_GetZaloOaListWith2Fk from '../../queryDB/GetZaloOaListWith2Fk';
import { accountType_enum, accountType_type } from '@src/dataStruct/account';

class Handle_GetZaloOaListWith2Fk {
    private _mssql_server = mssql_server;

    constructor() {}

    checkRole = (req: Request<any, any, ZaloOaListWith2FkBodyField>, res: Response, next: NextFunction) => {
        const zaloOaListWith2FkBody: ZaloOaListWith2FkBodyField = req.body;

        const myResponse: MyResponse<ZaloOaField[]> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetZaloOaListWith2Fk (checkRole) !',
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
            const accountId = zaloOaListWith2FkBody.accountId;
            if (id === accountId) {
                res.locals.role = accountType_enum.ADMIN;
            } else {
                res.locals.role = accountType_enum.MEMBER;
            }

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (req: Request<Record<string, never>, unknown, ZaloOaListWith2FkBodyField>, res: Response) => {
        const role: accountType_type = res.locals.role as accountType_type;
        const zaloOaListWith2FkBody = req.body;

        const myResponse: MyResponse<PagedZaloOaField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetZaloOaListWith2Fk (main) !',
        };

        await this._mssql_server.init();

        const queryDB = new QueryDB_GetZaloOaListWith2Fk();
        queryDB.setZaloOaListWith2FkBody(zaloOaListWith2FkBody);

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
                const rows: ZaloOaField[] = result.recordset;
                const zaloOas: ZaloOaField[] = [];
                for (let i: number = 0; i < rows.length; i++) {
                    if (role !== accountType_enum.ADMIN) {
                        const zaloOa = { ...rows[i] };
                        // zaloOa.oaId = 'Bạn không phải admin';
                        zaloOa.oaSecret = 'Bạn không phải admin';
                        zaloOas.push(zaloOa);
                    } else {
                        zaloOas.push(rows[i]);
                    }
                }
                myResponse.data = { items: zaloOas, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy danh sách zalo-oa thành công (GetZaloOaListWith2Fk) !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy danh sách zalo-oa KHÔNG thành công (GetZaloOaListWith2Fk) 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy danh sách zalo-oa KHÔNG thành công (GetZaloOaListWith2Fk) 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetZaloOaListWith2Fk;
