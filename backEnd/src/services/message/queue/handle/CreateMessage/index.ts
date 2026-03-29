import { mssql_server } from '@src/connect';
import { MessageField, CreateMessageBodyField } from '@src/dataStruct/message';
import MutateDB_CreateMessage from '../../db/CreateMessage';
// import { produceTask } from '@src/queueRedis/producer';

class Handle_CreateMessage {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (createMessageBody: CreateMessageBodyField, callback: (message: MessageField | null) => void) => {
        await this._mssql_server.init();

        const mutateDB_createMessage = new MutateDB_CreateMessage();
        mutateDB_createMessage.setCreateMessageBody(createMessageBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_createMessage.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await mutateDB_createMessage.run();
            let data: MessageField | null = null;
            if (result?.recordset.length && result?.recordset.length > 0) {
                data = result.recordset[0];
            } else {
                data = null;
            }
            callback(data);
        } catch (error) {
            console.error('Handle_CreateMessage', error);
        }
    };
}

export default Handle_CreateMessage;
