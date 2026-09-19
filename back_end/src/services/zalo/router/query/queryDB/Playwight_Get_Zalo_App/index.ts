import { pool } from '@src/connect/postgresql';
import { Zalo_App_Field } from '@src/data_struct/zalo';
import { Playwight_Get_Zalo_App_Body_Field } from '@src/data_struct/zalo/body';

class QueryDB_Playwight_Get_Zalo_App {
    private _playwight_get_zalo_app_body: Playwight_Get_Zalo_App_Body_Field | undefined;

    set_Playwight_Get_Zalo_App_Body(playwight_get_zalo_app_body: Playwight_Get_Zalo_App_Body_Field): void {
        this._playwight_get_zalo_app_body = playwight_get_zalo_app_body;
    }

    async run(): Promise<Zalo_App_Field | void> {
        if (this._playwight_get_zalo_app_body !== undefined) {
            try {
                const result = await pool.query<Zalo_App_Field>(`SELECT * FROM playwright_get_zalo_app($1, $2);`, [
                    this._playwight_get_zalo_app_body.user_name,
                    this._playwight_get_zalo_app_body.password,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Playwight_Get_Zalo_App;
