import sql from 'mssql';
import { MutateDB } from '@src/services/account/interface';
import { AccountField, AddMemberBodyField } from '@src/dataStruct/account';

class MutateDB_AddMember extends MutateDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _addMemberBody: AddMemberBodyField | undefined;

    constructor() {
        super();
    }

    set_connection_pool = (connectionPool: sql.ConnectionPool): void => {
        this._connectionPool = connectionPool;
    };

    setAddMemberBody = (addMemberBody: AddMemberBodyField) => {
        this._addMemberBody = addMemberBody;
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
        if (this._connectionPool !== undefined && this._addMemberBody !== undefined) {
            try {
                const result = AddMemberToDB(this._connectionPool, this._addMemberBody);
                return result;
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('MutateDB_AddMember: error method run()');
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

async function AddMemberToDB(
    pool: sql.ConnectionPool,
    addMemberBody: AddMemberBodyField
): Promise<sql.IProcedureResult<AccountField>> {
    const conn = await pool;
    const result = await conn
        .request()
        .input('userName', sql.NVarChar, addMemberBody.userName)
        .input('password', sql.NVarChar, addMemberBody.password)
        .input('phone', sql.NVarChar, addMemberBody.phone)
        .input('firstName', sql.NVarChar, addMemberBody.firstName)
        .input('lastName', sql.NVarChar, addMemberBody.lastName)
        .input('addedById', sql.Int, addMemberBody.addedById)
        .execute('CreateMember');

    return result;
}

export default MutateDB_AddMember;
