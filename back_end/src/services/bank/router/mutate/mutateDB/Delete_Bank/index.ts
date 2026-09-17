import { pool } from '@src/connect/postgresql';
import { Bank_Field } from '@src/data_struct/bank';
import { Delete_Bank_Body_Field } from '@src/data_struct/bank/body';

class MutateDB_Delete_Bank {
    private _delete_bank_body: Delete_Bank_Body_Field | undefined;

    set_Delete_Bank_Body(delete_bank_body: Delete_Bank_Body_Field): void {
        this._delete_bank_body = delete_bank_body;
    }

    async run(): Promise<Bank_Field | undefined> {
        if (this._delete_bank_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Bank_Field>(`SELECT * FROM delete_bank($1, $2);`, [
                    this._delete_bank_body.id,
                    this._delete_bank_body.account_id,
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

export default MutateDB_Delete_Bank;
