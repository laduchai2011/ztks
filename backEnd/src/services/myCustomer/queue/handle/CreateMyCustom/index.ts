import { mssql_server } from '@src/connect';
import { MyCustomerField, CreateMyCustomerBodyField } from '@src/dataStruct/myCustomer';
import MutateDB_CreateMyCustom from '../../db/CreateMyCustom';

class Handle_CreateMyCustom {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (
        createMyCustomBody: CreateMyCustomerBodyField,
        callback: (myCustomer: MyCustomerField | null) => void
    ) => {
        await this._mssql_server.init();

        const mutateDB_createMyCustom = new MutateDB_CreateMyCustom();
        mutateDB_createMyCustom.setCreateMyCustomerBody(createMyCustomBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_createMyCustom.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await mutateDB_createMyCustom.run();
            let data: MyCustomerField | null = null;
            if (result?.recordset.length && result?.recordset.length > 0) {
                data = result?.recordset[0];
            } else {
                data = null;
            }
            callback(data);
        } catch (error) {
            console.error('Handle_CreateMyCustom', error);
        }
    };
}

export default Handle_CreateMyCustom;
