import { Update_Statistics_Body_Field } from '@src/data_struct/statistics/body';
import MutateDB_Update_Statistics from '../../mutateDB/Update_Statistics';

export async function is_Update_Statistics(body: Update_Statistics_Body_Field): Promise<boolean> {
    const mutateDB = new MutateDB_Update_Statistics();
    mutateDB.set_Update_Statistics_Body(body);

    try {
        const result = await mutateDB.run();
        if (result) {
            console.log('Statistics -> handle -> is_Update_Statistics', 'Cập nhật doanh số thành công !');
            return true;
        } else {
            console.error('Statistics -> handle -> is_Update_Statistics', 'Cập nhật doanh số thất bại !');
            return false;
        }
    } catch (error) {
        console.error('Statistics -> handle -> is_Update_Statistics', error);
        return false;
    }
}
