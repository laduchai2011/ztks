import sql from 'mssql';
import { ChatRoomRoleField } from '@src/dataStruct/chatRoom';
import { UpdateSetupChatRoomRoleBodyField } from '@src/dataStruct/chatRoom/body';

class MutateDB_UpdateSetupChatRoomRole {
    private _connectionPool: sql.ConnectionPool | undefined;
    private _updateSetupChatRoomRoleBody: UpdateSetupChatRoomRoleBodyField | undefined;

    constructor() {}

    set_connection_pool(connectionPool: sql.ConnectionPool): void {
        this._connectionPool = connectionPool;
    }

    setUpdateSetupChatRoomRoleBody(updateSetupChatRoomRoleBody: UpdateSetupChatRoomRoleBodyField): void {
        this._updateSetupChatRoomRoleBody = updateSetupChatRoomRoleBody;
    }

    async run(): Promise<sql.IProcedureResult<ChatRoomRoleField> | undefined> {
        if (this._connectionPool !== undefined && this._updateSetupChatRoomRoleBody !== undefined) {
            try {
                const result = await this._connectionPool
                    .request()
                    .input('id', sql.Int, this._updateSetupChatRoomRoleBody.id)
                    .input('backGroundColor', sql.NVarChar(255), this._updateSetupChatRoomRoleBody.backGroundColor)
                    .input('isRead', sql.Bit, this._updateSetupChatRoomRoleBody.isRead)
                    .input('isSend', sql.Bit, this._updateSetupChatRoomRoleBody.isSend)
                    .input('accountId', sql.Int, this._updateSetupChatRoomRoleBody.accountId)
                    .execute('UpdateSetupChatRoomRole');

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default MutateDB_UpdateSetupChatRoomRole;
