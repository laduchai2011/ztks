import { pool } from '@src/connect/postgresql';
import { Bank_Field } from '@src/data_struct/bank';
import { Add_Bank_Body_Field } from '@src/data_struct/bank/body';

class MutateDB_Add_Bank {
    private _add_bank_body: Add_Bank_Body_Field | undefined;

    set_Add_Bank_Body(add_bank_body: Add_Bank_Body_Field): void {
        this._add_bank_body = add_bank_body;
    }

    async run(): Promise<Bank_Field | undefined> {
        if (this._add_bank_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Bank_Field>(`SELECT * FROM add_bank($1, $2, $3, $4);`, [
                    this._add_bank_body.bank_code,
                    this._add_bank_body.account_number,
                    this._add_bank_body.account_name,
                    this._add_bank_body.account_id,
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

export default MutateDB_Add_Bank;
