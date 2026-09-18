import { pool } from '@src/connect/postgresql';
import { Require_Take_Money_Field } from '@src/data_struct/wallet';
import { Member_Ztks_Confirm_Take_Money_Body_Field } from '@src/data_struct/wallet/body';

class MutateDB_Edit_Require_Take_Money {
    private _member_ztks_confirm_take_money_body: Member_Ztks_Confirm_Take_Money_Body_Field | undefined;

    set_Member_Ztks_Confirm_Take_Money_Body(
        member_ztks_confirm_take_money_body: Member_Ztks_Confirm_Take_Money_Body_Field
    ): void {
        this._member_ztks_confirm_take_money_body = member_ztks_confirm_take_money_body;
    }

    async run(): Promise<Require_Take_Money_Field | undefined> {
        if (this._member_ztks_confirm_take_money_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Require_Take_Money_Field>(
                    `SELECT * FROM member_ztks_confirm_take_money($1, $2);`,
                    [
                        this._member_ztks_confirm_take_money_body.require_take_money_id,
                        this._member_ztks_confirm_take_money_body.member_ztks_id,
                    ]
                );

                await client.query('COMMIT');

                return result.rows[0];
            } catch (error) {
                console.error(error);
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Edit_Require_Take_Money;
