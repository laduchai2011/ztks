import { mssql_server } from '@src/connect';
import { StatisticsField } from '@src/dataStruct/statistics';
import { GetStatisticsOfDayBodyField } from '@src/dataStruct/statistics/body';
import QueryDB_GetStatisticsOfDay from '../../queryDB/GetStatisticsOfDay';

export async function getStatisticsOfDay(body: GetStatisticsOfDayBodyField) {
    await mssql_server.init();

    const queryDB = new QueryDB_GetStatisticsOfDay();
    queryDB.setGetStatisticsOfDayBody(body);

    const connection_pool = mssql_server.get_connectionPool();
    if (connection_pool) {
        queryDB.set_connection_pool(connection_pool);
    } else {
        console.error('Statistics -> handle -> getStatisticsOfDay', 'Kết nối cơ sở dữ liệu không thành công !');
        return;
    }

    try {
        const result = await queryDB.run();
        if (result?.recordset.length && result?.recordset.length > 0) {
            console.log('Statistics -> handle -> getStatisticsOfDay', 'Lấy doanh số thành công !');
            const statistics: StatisticsField = result.recordset[0];
            return statistics;
        } else {
            console.error('Statistics -> handle -> getStatisticsOfDay', 'Lấy doanh số thất bại !');
            return;
        }
    } catch (error) {
        console.error('Statistics -> handle -> getStatisticsOfDay', error);
        return;
    }
}
