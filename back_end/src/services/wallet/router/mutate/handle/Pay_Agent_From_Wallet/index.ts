import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Wallet_Field } from '@src/data_struct/wallet';
import { Pay_Agent_From_Wallet_Body_Field } from '@src/data_struct/wallet/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Pay_Agent_From_Wallet from '../../mutateDB/Pay_Agent_From_Wallet';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Pay_Agent_From_Wallet {
    setup = async (req: Request<any, any, Pay_Agent_From_Wallet_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Wallet_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Pay_Agent_From_Wallet-setup)',
        };

        const pay_agent_from_wallet_body = req.body;
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
            pay_agent_from_wallet_body.account_id = id;
            res.locals.pay_agent_from_wallet_body = pay_agent_from_wallet_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const pay_agent_from_wallet_body = res.locals.pay_agent_from_wallet_body as Pay_Agent_From_Wallet_Body_Field;

        const my_response: My_Response_Field<Wallet_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Pay_Agent_From_Wallet-main)',
        };

        const mutateDB = new MutateDB_Pay_Agent_From_Wallet();
        mutateDB.set_Pay_Agent_From_Wallet_Body(pay_agent_from_wallet_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Thanh toán agent thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Thanh toán agent KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Thanh toán agent KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Pay_Agent_From_Wallet;
