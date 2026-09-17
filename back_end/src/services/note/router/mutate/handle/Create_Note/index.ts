import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Note_Field } from '@src/data_struct/note';
import { Create_Note_Body_Field } from '@src/data_struct/note/body';
import { verify_refresh_token } from '@src/token';
import MutateDB_Create_Note from '../../mutateDB/Create_Note';
import { Cache_Get_Chat_Room_With_Id } from '@src/const/redisKey/chat_room';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Note {
    private _serviceRedis = ServiceRedis.getInstance();
    private _cache_get_chat_room_with_id = new Cache_Get_Chat_Room_With_Id({ log_prameter: 'Handle_Create_Note' });

    constructor() {
        this._serviceRedis.init();
        this._cache_get_chat_room_with_id.init();
    }

    setup = async (req: Request<any, any, Create_Note_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Note_Field> = {
            is_success: false,
        };

        const create_note_body = req.body;
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
            create_note_body.account_id = id;
            res.locals.create_note_body = create_note_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_note_body = res.locals.create_note_body as Create_Note_Body_Field;

        const my_response: My_Response_Field<Note_Field> = {
            is_success: false,
        };

        const mutateDB = new MutateDB_Create_Note();
        mutateDB.set_Create_Note_Body(create_note_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Tạo ghi chú thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo ghi chú KHÔNG thành công 1 !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo ghi chú KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Note;
