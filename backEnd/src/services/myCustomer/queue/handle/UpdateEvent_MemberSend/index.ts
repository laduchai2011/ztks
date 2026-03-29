import { mssql_server } from '@src/connect';
import { MessageField, UpdateEventMemberSendBodyField } from '@src/dataStruct/message';
import MutateDB_UpdateEvent_MemberSend from '../../db/UpdateEvent_MemberSend';

class Handle_UpdateEvent_MemberSend {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (
        updateEventMemberSendBody: UpdateEventMemberSendBodyField,
        callback: (message: MessageField | null) => void
    ) => {
        await this._mssql_server.init();

        const mutateDB_updateEvent_memberSend = new MutateDB_UpdateEvent_MemberSend();
        mutateDB_updateEvent_memberSend.setUpdateEventMemberSendBody(updateEventMemberSendBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_updateEvent_memberSend.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await mutateDB_updateEvent_memberSend.run();
            let data: MessageField | null = null;
            if (result?.recordset.length && result?.recordset.length > 0) {
                data = result?.recordset[0];
            } else {
                data = null;
            }
            callback(data);
        } catch (error) {
            console.error('Handle_UpdateEvent_MemberSend', error);
        }
    };
}

export default Handle_UpdateEvent_MemberSend;
