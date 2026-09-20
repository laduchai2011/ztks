import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import MutateDB_Update_Note from '../../mutateDB/Update_Note';
import { verify_Refresh_Token } from '@src/token';
import { Note_Field } from '@src/data_struct/note';
import { Update_Note_Body_Field } from '@src/data_struct/note/body';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Update_Note {
    setup = async (req: Request<any, any, Update_Note_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Note_Field> = {
            is_success: false,
            message: 'Băt đầu (Handle_Update_Note-setup) !',
        };

        const update_note_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_Refresh_Token(refreshToken);

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
            update_note_body.account_id = id;
            res.locals.update_note_body = update_note_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const update_note_body = res.locals.update_note_body as Update_Note_Body_Field;

        const my_response: My_Response_Field<Note_Field> = {
            is_success: false,
            message: 'Băt đầu cập nhật (Handle_Update_Note-main) !',
        };

        const mutateDB = new MutateDB_Update_Note();
        mutateDB.set_Update_Note_Body(update_note_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Cập nhật ghi chú thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Cập nhật ghi chú KHÔNG thành công !';
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

export default Handle_Update_Note;
