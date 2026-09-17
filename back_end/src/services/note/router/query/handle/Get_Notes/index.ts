import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Paged_Note_Field, Note_Field } from '@src/data_struct/note';
import { Get_Notes_Body_Field } from '@src/data_struct/note/body';
import QueryDB_Get_Notes from '../../queryDB/Get_Notes';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_Notes {
    setup = async (req: Request<any, any, Get_Notes_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Note_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Notes-setup)',
        };

        const get_notes_body = req.body;
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
            get_notes_body.account_id = id;
            res.locals.get_notes_body = get_notes_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const get_notes_body = res.locals.get_notes_body as Get_Notes_Body_Field;

        const my_response: My_Response_Field<Paged_Note_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Notes-main)',
        };

        const queryDB = new QueryDB_Get_Notes();
        queryDB.set_Get_Notes_Body(get_notes_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy ghi chú thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy ghi chú KHÔNG thành công 1 !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy ghi chú KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Notes;
