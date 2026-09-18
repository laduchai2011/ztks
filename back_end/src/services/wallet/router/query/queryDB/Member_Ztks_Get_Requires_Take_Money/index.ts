import { pool } from '@src/connect/postgresql';
import { Require_Take_Money_Field, Paged_Require_Take_Money_Field } from '@src/data_struct/wallet';
import { Member_Ztks_Get_Requires_Take_Money_Body_Field } from '@src/data_struct/wallet/body';

class QueryDB_Member_Ztks_Get_Requires_Take_Money {
    private _member_ztks_get_requires_take_money_body: Member_Ztks_Get_Requires_Take_Money_Body_Field | undefined;

    set_Member_Ztks_Get_Requires_Take_Money_Body(
        member_ztks_get_requires_take_money_body: Member_Ztks_Get_Requires_Take_Money_Body_Field
    ): void {
        this._member_ztks_get_requires_take_money_body = member_ztks_get_requires_take_money_body;
    }

    async run(): Promise<Paged_Require_Take_Money_Field | void> {
        if (this._member_ztks_get_requires_take_money_body !== undefined) {
            const member_ztks_id = this._member_ztks_get_requires_take_money_body.member_ztks_id
                ? this._member_ztks_get_requires_take_money_body.member_ztks_id
                : null;
            const is_do = this._member_ztks_get_requires_take_money_body.is_do
                ? this._member_ztks_get_requires_take_money_body.is_do
                : null;
            const money_from = this._member_ztks_get_requires_take_money_body.money_from
                ? this._member_ztks_get_requires_take_money_body.money_from
                : null;
            const money_to = this._member_ztks_get_requires_take_money_body.money_to
                ? this._member_ztks_get_requires_take_money_body.money_to
                : null;
            const do_from_date = this._member_ztks_get_requires_take_money_body.do_from_date
                ? this._member_ztks_get_requires_take_money_body.do_from_date
                : null;
            const do_to_date = this._member_ztks_get_requires_take_money_body.do_to_date
                ? this._member_ztks_get_requires_take_money_body.do_to_date
                : null;
            const from_date = this._member_ztks_get_requires_take_money_body.from_date
                ? this._member_ztks_get_requires_take_money_body.from_date
                : null;
            const to_date = this._member_ztks_get_requires_take_money_body.to_date
                ? this._member_ztks_get_requires_take_money_body.to_date
                : null;

            try {
                const result = await pool.query<{
                    items: Require_Take_Money_Field[];
                    total_count: string;
                }>(`SELECT * FROM member_ztks_get_requires_take_money($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`, [
                    this._member_ztks_get_requires_take_money_body.page,
                    this._member_ztks_get_requires_take_money_body.size,
                    member_ztks_id,
                    is_do,
                    money_from,
                    money_to,
                    do_from_date,
                    do_to_date,
                    from_date,
                    to_date,
                ]);

                const data: Paged_Require_Take_Money_Field = {
                    items: result.rows[0].items,
                    total_count: Number(result.rows[0].total_count),
                };

                return data;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Member_Ztks_Get_Requires_Take_Money;
