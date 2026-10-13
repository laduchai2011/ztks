import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Depot_Role_Field } from '@src/data_struct/shop';
import { Admin_Set_Depot_Role_For_One_Team_Body_Field } from '@src/data_struct/shop/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Admin_Set_Depot_Role_For_One_Team from '../../mutateDB/Admin_Set_Depot_Role_For_One_Team';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Admin_Set_Depot_Role_For_One_Team {
    setup = async (
        req: Request<any, any, Admin_Set_Depot_Role_For_One_Team_Body_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const my_response: My_Response_Field<Depot_Role_Field[]> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Admin_Set_Depot_Role_For_One_Team-setup)',
        };

        const admin_set_depot_role_for_one_team_body = req.body;
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
            admin_set_depot_role_for_one_team_body.admin_account_id = id;

            res.locals.admin_set_depot_role_for_one_team_body = admin_set_depot_role_for_one_team_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const admin_set_depot_role_for_one_team_body = res.locals
            .admin_set_depot_role_for_one_team_body as Admin_Set_Depot_Role_For_One_Team_Body_Field;

        const my_response: My_Response_Field<Depot_Role_Field[]> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Admin_Set_Depot_Role_For_One_Team-main)',
        };

        const mutateDB = new MutateDB_Admin_Set_Depot_Role_For_One_Team();
        mutateDB.set_Admin_Set_Depot_Role_For_One_Team_Body(admin_set_depot_role_for_one_team_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Thiết lập quy luật cho kho với nhóm thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Thiết lập quy luật cho kho với nhóm KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Thiết lập quy luật cho kho với nhóm KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Admin_Set_Depot_Role_For_One_Team;
