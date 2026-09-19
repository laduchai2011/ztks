import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { verify_refresh_token } from '@src/token';
import { Zalo_Oa_Field, Paged_Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Get_Zalo_Oa_List_With_2_Fk_Body_Field } from '@src/data_struct/zalo/body';
import QueryDB_Get_Zalo_Oa_List_With_2_Fk from '../../queryDB/Get_Zalo_Oa_List_With_2_Fk';
import { account_type_enum, account_type_type } from '@src/data_struct/account';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_Zalo_Oa_List_With_2_Fk {
    check_Role = (req: Request<any, any, Get_Zalo_Oa_List_With_2_Fk_Body_Field>, res: Response, next: NextFunction) => {
        const get_zalo_oa_list_with_2_fk_body: Get_Zalo_Oa_List_With_2_Fk_Body_Field = req.body;

        const my_response: My_Response_Field<Paged_Zalo_Oa_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Zalo_Oa_List_With_2_Fk (check_Role) !',
        };

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
            const account_id = get_zalo_oa_list_with_2_fk_body.account_id;
            if (id === account_id) {
                res.locals.role = account_type_enum.ADMIN;
            } else {
                res.locals.role = account_type_enum.MEMBER;
            }

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (req: Request<any, any, Get_Zalo_Oa_List_With_2_Fk_Body_Field>, res: Response) => {
        const role: account_type_type = res.locals.role as account_type_type;
        const get_zalo_oa_list_with_2_fk_body = req.body;

        const my_response: My_Response_Field<Paged_Zalo_Oa_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Zalo_Oa_List_With_2_Fk (main) !',
        };

        const queryDB = new QueryDB_Get_Zalo_Oa_List_With_2_Fk();
        queryDB.set_Get_Zalo_Oa_List_With_2_Fk_Body(get_zalo_oa_list_with_2_fk_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const items: Zalo_Oa_Field[] = result.items;
                const zalo_oas: Zalo_Oa_Field[] = [];
                for (let i: number = 0; i < items.length; i++) {
                    if (role !== account_type_enum.ADMIN) {
                        const zalo_oa = { ...items[i] };
                        // zaloOa.oaId = 'Bạn không phải admin';
                        zalo_oa.oa_secret = 'Bạn không phải admin';
                        zalo_oas.push(zalo_oa);
                    } else {
                        zalo_oas.push(items[i]);
                    }
                }
                my_response.data = { items: zalo_oas, total_count: result.total_count };
                my_response.message = 'Lấy danh sách zalo-oa thành công (Get_Zalo_Oa_List_With_2_Fk) !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy danh sách zalo-oa KHÔNG thành công (Get_Zalo_Oa_List_With_2_Fk) !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy danh sách zalo-oa KHÔNG thành công (Get_Zalo_Oa_List_With_2_Fk) !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Zalo_Oa_List_With_2_Fk;
