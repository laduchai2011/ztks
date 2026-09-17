import { pool } from '@src/connect/postgresql';
import { Bank_Field } from '@src/data_struct/bank';
import { Edit_Bank_Body_Field } from '@src/data_struct/bank/body';

class MutateDB_Edit_Bank {
    private _edit_bank_body: Edit_Bank_Body_Field | undefined;

    set_Edit_Bank_Body(edit_bank_body: Edit_Bank_Body_Field): void {
        this._edit_bank_body = edit_bank_body;
    }

    async run(): Promise<Bank_Field | undefined> {
        if (this._edit_bank_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Bank_Field>(`SELECT * FROM edit_bank($1, $2, $3, $4, $5);`, [
                    this._edit_bank_body.id,
                    this._edit_bank_body.bank_code,
                    this._edit_bank_body.account_number,
                    this._edit_bank_body.account_name,
                    this._edit_bank_body.account_id,
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

export default MutateDB_Edit_Bank;
