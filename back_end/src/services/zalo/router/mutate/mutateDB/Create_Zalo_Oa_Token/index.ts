import { pool } from '@src/connect/postgresql';
import { Zalo_Oa_Token_Field } from '@src/data_struct/zalo';
import { Create_Zalo_Oa_Token_Body_Field } from '@src/data_struct/zalo/body';

class MutateDB_Create_Zalo_Oa_Token {
    private _create_zalo_oa_token_body: Create_Zalo_Oa_Token_Body_Field | undefined;

    set_Create_Zalo_Oa_Token_Body(create_zalo_oa_token_body: Create_Zalo_Oa_Token_Body_Field): void {
        this._create_zalo_oa_token_body = create_zalo_oa_token_body;
    }

    async run(): Promise<Zalo_Oa_Token_Field | void> {
        if (this._create_zalo_oa_token_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Zalo_Oa_Token_Field>(
                    `SELECT * FROM create_zalo_oa_token($1, $2, $3);`,
                    [
                        this._create_zalo_oa_token_body.refresh_token,
                        this._create_zalo_oa_token_body.zalo_oa_id,
                        this._create_zalo_oa_token_body.account_id,
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

export default MutateDB_Create_Zalo_Oa_Token;
