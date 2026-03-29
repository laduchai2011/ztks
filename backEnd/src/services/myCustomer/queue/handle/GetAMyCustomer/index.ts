import { mssql_server } from '@src/connect';
import { MyCustomerField, AMyCustomerBodyField } from '@src/dataStruct/myCustomer';
import QueryDB_GetAMyCustomer from '../../db/GetAMyCustomer';

class Handle_GetAMyCustomer {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (aMyCustomerBody: AMyCustomerBodyField, callback: (myCustomer: MyCustomerField | null) => void) => {
        await this._mssql_server.init();

        const queryDB_getAMyCustomer = new QueryDB_GetAMyCustomer();
        queryDB_getAMyCustomer.setAMyCustomerBody(aMyCustomerBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB_getAMyCustomer.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await queryDB_getAMyCustomer.run();
            let data: MyCustomerField | null = null;
            if (result?.recordset.length && result?.recordset.length > 0) {
                data = result?.recordset[0];
            } else {
                data = null;
            }
            callback(data);
        } catch (error) {
            console.error('Handle_GetAMyCustomer', error);
        }
    };
}

export default Handle_GetAMyCustomer;
