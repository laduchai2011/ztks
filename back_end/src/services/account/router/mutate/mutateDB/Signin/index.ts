import { pool } from '@src/connect/postgresql';
import { signin_infor_type } from '../../handle/Signin/type';
import { Account_Field } from '@src/dataStruct/account';

class MutateDB_Signin {
    private _siggnin_infor: signin_infor_type | undefined;

    set_infor_input(signin_infor: signin_infor_type): void {
        this._siggnin_infor = signin_infor;
    }

    async run() {
        if (this._siggnin_infor !== undefined) {
            try {
                const result = await pool.query<Account_Field>(`SELECT * FROM signin($1, $2);`, [
                    this._siggnin_infor.user_name,
                    this._siggnin_infor.password,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }
}

export default MutateDB_Signin;
