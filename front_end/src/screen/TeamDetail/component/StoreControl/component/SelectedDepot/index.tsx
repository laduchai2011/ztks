import { memo } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { set__is_show_depot_list_dialog } from '@src/redux/slice/Team_Detail';
import { Depot_Field } from '@src/data_struct/shop';

const SelectedDepot = () => {
    const dispatch = useDispatch<AppDispatch>();

    const selected_depot: Depot_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.selected_depot
    );

    const handle_Open_Depot_List_Dialog = () => {
        dispatch(set__is_show_depot_list_dialog(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.text}>Kho</div>
            <div className={style.btn} onClick={() => handle_Open_Depot_List_Dialog()}>
                Chọn
            </div>
            {selected_depot && (
                <div className={style.icons}>
                    <FaLock size={20} color="red" />
                    <FaLockOpen size={20} color="gray" />
                </div>
            )}
            {selected_depot && <div>{selected_depot.name}</div>}
        </div>
    );
};

export default memo(SelectedDepot);
