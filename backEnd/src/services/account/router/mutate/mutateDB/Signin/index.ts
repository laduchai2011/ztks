import sql from 'mssql';
import { MutateDB } from '@src/services/account/interface';
import { signin_infor_type } from '../../handle/Signin/type';
import { AccountField } from '@src/dataStruct/account';

class MutateDB_Signin extends MutateDB {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _siggnin_infor: signin_infor_type | undefined;

    constructor() {
        super();
    }

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    set_infor_input(signin_infor: signin_infor_type): void {
        this._siggnin_infor = signin_infor;
    }

    async run(): Promise<sql.IResult<AccountField> | undefined> {
        if (this._connectionPool !== undefined && this._siggnin_infor !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('userName', sql.NVarChar(100), this._siggnin_infor.userName)
                    .input('password', sql.NVarChar(100), this._siggnin_infor.password)
                    .query(`SELECT * FROM dbo.Signin(@userName, @password)`);

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_Signin;
