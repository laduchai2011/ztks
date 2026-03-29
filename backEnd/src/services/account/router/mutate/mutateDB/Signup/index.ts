import sql from 'mssql';
import { MutateDB } from '@src/services/account/interface';
import { signup_infor_type } from '../../handle/Signup/type';
import { AccountField } from '@src/dataStruct/account';

class MutateDB_Signup extends MutateDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _signup_infor: signup_infor_type | undefined;

    constructor() {
        super();
    }

    set_connection_pool = (connectionPool: sql.ConnectionPool): void => {
        this._connectionPool = connectionPool;
    };

    set_data = (account: AccountField) => {
        this._signup_infor = account;
    };

    isAccountCheckUserName = async (userName: string): Promise<boolean> => {
        if (this._connectionPool !== undefined) {
            return await isAccountCheckUserName(this._connectionPool, userName);
        }
        return false;
    };

    isAccountCheckPhone = async (phone: string): Promise<boolean> => {
        if (this._connectionPool !== undefined) {
            return await isAccountCheckPhone(this._connectionPool, phone);
        }
        return false;
    };

    async run(): Promise<sql.IResult<AccountField> | void> {
        if (this._connectionPool !== undefined && this._signup_infor !== undefined) {
            try {
                const result = SignupToDB(this._connectionPool, this._signup_infor);
                return result;
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('MutateDB_Signup: error method run()');
        }
    }
}

async function isAccountCheckUserName(pool: sql.ConnectionPool, userName: string): Promise<boolean> {
    const conn = await pool;
    const existing = await conn
        .request()
        .input('userName', sql.NVarChar, userName)
        .query('SELECT 1 FROM account WHERE userName = @userName');

    if (existing.recordset.length > 0) {
        return true;
    }
    return false;
}

async function isAccountCheckPhone(pool: sql.ConnectionPool, phone: string): Promise<boolean> {
    const conn = await pool;
    const existing = await conn
        .request()
        .input('phone', sql.NVarChar, phone)
        .query('SELECT 1 FROM account WHERE phone = @phone');

    if (existing.recordset.length > 0) {
        return true;
    }
    return false;
}

async function SignupToDB(
    pool: sql.ConnectionPool,
    account: AccountField
): Promise<sql.IProcedureResult<AccountField>> {
    const conn = await pool;
    const result = await conn
        .request()
        .input('userName', sql.NVarChar, account.userName)
        .input('password', sql.NVarChar, account.password)
        .input('phone', sql.NVarChar, account.phone)
        .input('firstName', sql.NVarChar, account.firstName)
        .input('lastName', sql.NVarChar, account.lastName)
        .execute('Signup');

    return result;
}

export default MutateDB_Signup;
