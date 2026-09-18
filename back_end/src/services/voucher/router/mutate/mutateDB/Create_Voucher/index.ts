import { pool } from '@src/connect/postgresql';
import { Voucher_Field } from '@src/data_struct/voucher';
import { Create_Voucher_Body_Field } from '@src/data_struct/voucher/body';

class MutateDB_Create_Voucher {
    private _create_voucher_body: Create_Voucher_Body_Field | undefined;

    set_Create_Voucher_Body(create_voucher_body: Create_Voucher_Body_Field): void {
        this._create_voucher_body = create_voucher_body;
    }

    async run(): Promise<Voucher_Field | undefined> {
        if (this._create_voucher_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Voucher_Field>(`SELECT * FROM create_voucher($1, $2, $3, $4);`, [
                    this._create_voucher_body.day_amount,
                    this._create_voucher_body.money,
                    this._create_voucher_body.phone,
                    this._create_voucher_body.member_ztks_id,
                ]);

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

export default MutateDB_Create_Voucher;
