import { pool } from '@src/connect/postgresql';
import { MutateDB } from '@src/services/account/interface';
import { signup_infor_type } from '../../handle/Signup/type';
import { Account_Field } from '@src/dataStruct/account';

class MutateDB_Signup {
    private _signup_infor: signup_infor_type | undefined;

    set_data = (account: Account_Field) => {
        this._signup_infor = account;
    };

    is_Account_Check_User_Name = async (user_name: string): Promise<boolean> => {
        return await is_Account_Check_User_Name(user_name);
    };

    is_Account_Check_Phone = async (phone: string): Promise<boolean> => {
        return await is_Account_Check_Phone(phone);
    };

    async run(): Promise<Account_Field | void> {
        if (this._signup_infor !== undefined) {
            try {
                const result = signup_To_Db(this._signup_infor);
                return result;
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('MutateDB_Signup: error method run()');
        }
    }
}

async function is_Account_Check_User_Name(user_name: string): Promise<boolean> {
    const result = await pool.query(
        `SELECT 1 FROM account WHERE user_name = $1 LIMIT 1;`,
        [user_name]
    );

    const exists = result.rows.length > 0;

    if (exists) {
        return true;
    }
    return false;
}

async function is_Account_Check_Phone(phone: string): Promise<boolean> {
    const result = await pool.query(
        `SELECT 1 FROM account WHERE phone = $1 LIMIT 1;`,
        [phone]
    );

    const exists = result.rows.length > 0;

    if (exists) {
        return true;
    }
    return false;
}

async function signup_To_Db(account: Account_Field): Promise<Account_Field | undefined> {
    const client = await pool.connect();

    try {

        await client.query('BEGIN');
                                                                        
        const result = await pool.query<Account_Field>(`SELECT * FROM signup($1, $2, $3, $4, $5);`, [
            account.user_name,
            account.password,
            account.phone,
            account.first_name,
            account.last_name
        ]);
        
        await client.query('COMMIT');

        return result.rows[0];
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }
}

export default MutateDB_Signup;
