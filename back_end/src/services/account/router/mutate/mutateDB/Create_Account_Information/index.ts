import { pool } from '@src/connect/postgresql';
import { Account_Information_Field, account_type_enum } from '@src/data_struct/account';
import { Create_Account_Information_Body_Field } from '@src/data_struct/account/body';

class MutateDB_Create_Account_Information {
    private _create_account_information_body: Create_Account_Information_Body_Field | undefined;

    set_Create_Account_Information_Body(create_account_information_body: Create_Account_Information_Body_Field): void {
        this._create_account_information_body = create_account_information_body;
    }

    async run(): Promise<Account_Information_Field | undefined> {
        if (this._create_account_information_body !== undefined) {
            const client = await pool.connect();

            try {
                const added_by_id =
                    this._create_account_information_body.account_type === account_type_enum.ADMIN
                        ? this._create_account_information_body.account_id
                        : null;

                await client.query('BEGIN');

                const result = await pool.query<Account_Information_Field>(
                    `SELECT * FROM create_account_information($1, $2, $3);`,
                    [
                        this._create_account_information_body.account_type,
                        this._create_account_information_body.account_id,
                        added_by_id,
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

export default MutateDB_Create_Account_Information;
