import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Team_Member_Field } from '@src/data_struct/team';
import { Add_Team_Member_Body_Field } from '@src/data_struct/team/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Add_Team_Member from '../../mutateDB/Add_Team_Member';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Add_Team_Member {
    setup = async (req: Request<any, any, Add_Team_Member_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Team_Member_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Add_Team_Member-setup)',
        };

        const add_team_member_body = req.body;
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
            add_team_member_body.admin_account_id = id;

            res.locals.add_team_member_body = add_team_member_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const add_team_member_body = res.locals.add_team_member_body as Add_Team_Member_Body_Field;

        const my_response: My_Response_Field<Team_Member_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Add_Team_Member-main)',
        };

        const mutateDB = new MutateDB_Add_Team_Member();
        mutateDB.set_Add_Team_Member_Body(add_team_member_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Thêm thành viên nhóm thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Thêm thành viên nhóm KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Thêm thành viên nhóm KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Add_Team_Member;
