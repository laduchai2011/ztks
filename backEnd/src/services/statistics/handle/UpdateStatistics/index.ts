import { mssql_server } from '@src/connect';
import { UpdateStatisticsBodyField } from '@src/dataStruct/statistics/body';
import MutateDB_UpdateStatistics from '../../mutateDB/UpdateStatistics';

export async function updateStatistics(body: UpdateStatisticsBodyField) {
    await mssql_server.init();

    const mutateDB = new MutateDB_UpdateStatistics();
    mutateDB.setUpdateStatisticsBody(body);

    const connection_pool = mssql_server.get_connectionPool();
    if (connection_pool) {
        mutateDB.set_connection_pool(connection_pool);
    } else {
        console.error('Statistics -> handle -> updateStatistics', 'Kết nối cơ sở dữ liệu không thành công !');
        return;
    }

    try {
        const result = await mutateDB.run();
        if (result?.recordset.length && result?.recordset.length > 0) {
            console.log('Statistics -> handle -> updateStatistics', 'Cập nhật doanh số thành công !');
            return;
        } else {
            console.error('Statistics -> handle -> updateStatistics', 'Cập nhật doanh số thất bại !');
            return;
        }
    } catch (error) {
        console.error('Statistics -> handle -> updateStatistics', error);
        return;
    }
}
