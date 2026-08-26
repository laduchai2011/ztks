import { mssql_server } from '@src/connect';
import { UpdateStatisticsWithOldOrderBodyField } from '@src/dataStruct/statistics/body';
import MutateDB_UpdateStatisticsWithOldOrder from '../../mutateDB/UpdateStatisticsWithOldOrder';

export async function updateStatisticsWithOldOrder(body: UpdateStatisticsWithOldOrderBodyField) {
    await mssql_server.init();

    const mutateDB = new MutateDB_UpdateStatisticsWithOldOrder();
    mutateDB.setUpdateStatisticsWithOldOrderBody(body);

    const connection_pool = mssql_server.get_connectionPool();
    if (connection_pool) {
        mutateDB.set_connection_pool(connection_pool);
    } else {
        console.error(
            'Statistics -> handle -> updateStatisticsWithOldOrder',
            'Kết nối cơ sở dữ liệu không thành công !'
        );
        return;
    }

    try {
        const result = await mutateDB.run();
        if (result?.recordset.length && result?.recordset.length > 0) {
            console.log('Statistics -> handle -> updateStatisticsWithOldOrder', 'Cập nhật doanh số thành công !');
            return;
        } else {
            console.error('Statistics -> handle -> updateStatisticsWithOldOrder', 'Cập nhật doanh số thất bại !');
            return;
        }
    } catch (error) {
        console.error('Statistics -> handle -> updateStatisticsWithOldOrder', error);
        return;
    }
}
