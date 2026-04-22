import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { RequireTakeMoneyField, PagedRequireTakeMoneyField } from '@src/dataStruct/wallet';
import { MemberZtksGetRequiresTakeMoneyBodyField } from '@src/dataStruct/wallet/body';
import QueryDB_MemberZtksGetRequiresTakeMoney from '../../queryDB/MemberZtksGetRequiresTakeMoney';
import { verifyRefreshToken } from '@src/token';

class Handle_MemberZtksGetRequiresTakeMoney {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = (req: Request<any, any, MemberZtksGetRequiresTakeMoneyBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<PagedRequireTakeMoneyField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_MemberZtksGetRequiresTakeMoney-setup',
        };

        const memberZtksGetRequiresTakeMoneyBody = req.body;
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
            memberZtksGetRequiresTakeMoneyBody.memberZtksId = id;
            res.locals.memberZtksGetRequiresTakeMoneyBody = memberZtksGetRequiresTakeMoneyBody;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const memberZtksGetRequiresTakeMoneyBody = res.locals
            .memberZtksGetRequiresTakeMoneyBody as MemberZtksGetRequiresTakeMoneyBodyField;

        const myResponse: MyResponse<PagedRequireTakeMoneyField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_MemberZtksGetRequiresTakeMoney-main',
        };

        const queryDB = new QueryDB_MemberZtksGetRequiresTakeMoney();
        queryDB.setMemberZtksGetRequiresTakeMoneyBody(memberZtksGetRequiresTakeMoneyBody);

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
                const rows: RequireTakeMoneyField[] = result.recordset;
                myResponse.data = { items: rows, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy những yêu cầu rút tiền thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy những yêu cầu rút tiền KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy những yêu cầu rút tiền KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_MemberZtksGetRequiresTakeMoney;
