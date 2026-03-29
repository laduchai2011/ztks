import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import MutateDB_AddMember from '../../mutateDB/AddMember';
import { AccountField, AddMemberBodyField } from '@src/dataStruct/account';
import { MyResponse } from '@src/dataStruct/response';
import { verifyRefreshToken } from '@src/token';

class Handle_AddMember {
    private _mssql_server = mssql_server;

    constructor() {}

    isAccountCheckUserName = async (
        req: Request<Record<string, never>, unknown, AddMemberBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const addMemberBody = req.body;

        await this._mssql_server.init();

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
        };

        const mutateDB_addMember = new MutateDB_AddMember();
        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_addMember.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu KHÔNG thành công !';
            res.status(200).json(myResponse);
        }

        mutateDB_addMember.setAddMemberBody(addMemberBody);

        const is = await mutateDB_addMember.isAccountCheckUserName(addMemberBody.userName);

        if (is) {
            myResponse.message = 'Tên người dùng đã được sử dụng !';
            res.status(200).json(myResponse);
        } else {
            next();
        }
    };

    isAccountCheckPhone = async (
        req: Request<Record<string, never>, unknown, AddMemberBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const addMemberBody = req.body;

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
        };

        await this._mssql_server.init();

        const mutateDB_addMember = new MutateDB_AddMember();
        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_addMember.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu KHÔNG thành công !';
            res.status(200).json(myResponse);
        }

        mutateDB_addMember.setAddMemberBody(addMemberBody);

        const is = await mutateDB_addMember.isAccountCheckPhone(addMemberBody.phone);

        if (is) {
            myResponse.message = 'Số điện thoại đã được sử dụng !';
            res.status(200).json(myResponse);
        } else {
            next();
        }
    };

    setup = (req: Request<Record<string, never>, unknown, AddMemberBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
        };

        const addMemberBody = req.body;
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
            const addMemberBody_cp = { ...addMemberBody };
            addMemberBody_cp.addedById = id;
            res.locals.addMemberBody = addMemberBody_cp;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const addMemberBody = res.locals.addMemberBody as AddMemberBodyField;

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
        };

        await this._mssql_server.init();

        const mutateDB_addMember = new MutateDB_AddMember();
        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_addMember.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu KHÔNG thành công !';
            res.status(200).json(myResponse);
        }

        if (connection_pool) {
            try {
                mutateDB_addMember.setAddMemberBody(addMemberBody);
                const result = await mutateDB_addMember.run();
                if (result?.recordset.length && result?.recordset.length > 0) {
                    myResponse.message = 'Thêm thành viên thành công !';
                    myResponse.isSuccess = true;
                    myResponse.data = result?.recordset[0];
                    res.json(myResponse);
                } else {
                    myResponse.message = 'Thêm thành viên KHÔNG thành công !';
                    res.status(200).json(myResponse);
                }
            } catch (error) {
                myResponse.message = 'Thêm thành viên thất bại !';
                myResponse.err = error;
                res.status(200).json(myResponse);
            }
        }
    };
}

export default Handle_AddMember;
