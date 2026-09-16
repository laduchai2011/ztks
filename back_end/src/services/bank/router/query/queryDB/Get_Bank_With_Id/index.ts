import { pool } from '@src/connect/postgresql';
import { Bank_Field } from '@src/dataStruct/bank';
import { Get_Bank_With_Id_Body_Field } from '@src/dataStruct/bank/body';

class QueryDB_Get_Bank_With_Id {
    
    private _get_bank_with_id_body: Get_Bank_With_Id_Body_Field | undefined;

    set_Get_Bank_With_Id_Body(get_bank_with_id_body: Get_Bank_With_Id_Body_Field): void {
        this._get_bank_with_id_body = get_bank_with_id_body;
    }

    async run(): Promise<Bank_Field | void> {
        if (this._get_bank_with_id_body !== undefined) {
            try {
                const result = await pool.query<Bank_Field>(`SELECT * FROM get_bank_with_id($1);`, [
                    this._get_bank_with_id_body.id
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Bank_With_Id;
