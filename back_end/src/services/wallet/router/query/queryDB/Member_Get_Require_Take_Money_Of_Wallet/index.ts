import { pool } from '@src/connect/postgresql';
import { Require_Take_Money_Field } from '@src/data_struct/wallet';
import { Member_Get_Require_Take_Money_Of_Wallet_Body_Field } from '@src/data_struct/wallet/body';

class QueryDB_Member_Get_Require_Take_Money_Of_Wallet {
    private _member_get_require_take_money_of_wallet_body:
        | Member_Get_Require_Take_Money_Of_Wallet_Body_Field
        | undefined;

    set_Member_Get_Require_Take_Money_Of_Wallet_Body(
        member_get_require_take_money_of_wallet_body: Member_Get_Require_Take_Money_Of_Wallet_Body_Field
    ): void {
        this._member_get_require_take_money_of_wallet_body = member_get_require_take_money_of_wallet_body;
    }

    async run(): Promise<Require_Take_Money_Field | void> {
        if (this._member_get_require_take_money_of_wallet_body !== undefined) {
            try {
                const result = await pool.query<Require_Take_Money_Field>(
                    `SELECT * FROM member_get_require_take_money_of_wallet($1, $2);`,
                    [
                        this._member_get_require_take_money_of_wallet_body.wallet_id,
                        this._member_get_require_take_money_of_wallet_body.account_id,
                    ]
                );

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Member_Get_Require_Take_Money_Of_Wallet;
