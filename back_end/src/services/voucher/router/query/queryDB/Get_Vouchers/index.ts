import { pool } from '@src/connect/postgresql';
import { Voucher_Field, Paged_Voucher_Field } from '@src/data_struct/voucher';
import { Get_Vouchers_Body_Field } from '@src/data_struct/voucher/body';

class QueryDB_Get_Vouchers {
    private _get_vouchers_body: Get_Vouchers_Body_Field | undefined;

    set_Get_Vouchers_Body(get_vouchers_body: Get_Vouchers_Body_Field): void {
        this._get_vouchers_body = get_vouchers_body;
    }

    async run(): Promise<Paged_Voucher_Field | void> {
        if (this._get_vouchers_body !== undefined) {
            const is_used = this._get_vouchers_body.is_used !== undefined ? this._get_vouchers_body.is_used : null;

            try {
                const result = await pool.query<{
                    items: Voucher_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_vouchers($1, $2, $3, $4);`, [
                    this._get_vouchers_body.page,
                    this._get_vouchers_body.size,
                    this._get_vouchers_body.phone,
                    is_used,
                ]);

                const data: Paged_Voucher_Field = {
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

export default QueryDB_Get_Vouchers;
