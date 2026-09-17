import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import MutateDB_Delete_Note from '../../mutateDB/Delete_Note';
import { verify_refresh_token } from '@src/token';
import { Note_Field } from '@src/data_struct/note';
import { Delete_Note_Body_Field } from '@src/data_struct/note/body';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Delete_Note {
    setup = async (req: Request<any, any, Delete_Note_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Note_Field> = {
            is_success: false,
            message: 'Băt đầu (Handle_Delete_Note-setup) !',
        };

        const delete_note_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_refresh_token(refreshToken);

            if (verify_refreshToken === 'invalid') {
                my_response.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            if (verify_refreshToken === 'expired') {
                my_response.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            const { id } = verify_refreshToken;
            delete_note_body.account_id = id;
            res.locals.delete_note_body = delete_note_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const delete_note_body = res.locals.delete_note_body as Delete_Note_Body_Field;

        const my_response: My_Response_Field<Note_Field> = {
            is_success: false,
            message: 'Băt đầu (Handle_Delete_Note-main) !',
        };

        const mutateDB = new MutateDB_Delete_Note();
        mutateDB.set_Delete_Note_Body(delete_note_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Xóa ghi chú thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Xóa ghi chú KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            console.error(error);
            my_response.message = 'Cập nhật ghi chú KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Delete_Note;
