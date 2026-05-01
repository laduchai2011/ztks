import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import MutateDB_DeleteNote from '../../mutateDB/DeleteNote';
import { verifyRefreshToken } from '@src/token';
import { NoteField } from '@src/dataStruct/note';
import { DeleteNoteBodyField } from '@src/dataStruct/note/body';

class Handle_DeleteNote {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, DeleteNoteBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<NoteField> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_DeleteNote-setup) !',
        };

        const deleteNoteBody = req.body;
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
            deleteNoteBody.accountId = id;
            res.locals.deleteNoteBody = deleteNoteBody;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const deleteNoteBody = res.locals.deleteNoteBody as DeleteNoteBodyField;

        const myResponse: MyResponse<NoteField> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_DeleteNote-main) !',
        };

        const mutateDB = new MutateDB_DeleteNote();
        mutateDB.setDeleteNoteBody(deleteNoteBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await mutateDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const rData = result.recordset[0];
                myResponse.message = 'Xóa ghi chú thành công !';
                myResponse.isSuccess = true;
                myResponse.data = rData;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Xóa ghi chú KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            console.error(error);
            myResponse.message = 'Cập nhật ghi chú KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_DeleteNote;
