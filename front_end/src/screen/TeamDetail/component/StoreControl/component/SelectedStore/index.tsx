import { memo } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { set__is_show_store_list_dialog } from '@src/redux/slice/Team_Detail';
import { Store_Field } from '@src/data_struct/shop';

const SelectedStore = () => {
    const dispatch = useDispatch<AppDispatch>();

    const selected_store: Store_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.selected_store
    );

    const handle_Open_Store_List_Dialog = () => {
        dispatch(set__is_show_store_list_dialog(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.text}>Gian hàng</div>
            <div className={style.btn} onClick={() => handle_Open_Store_List_Dialog()}>
                Chọn
            </div>
            {selected_store && (
                <div className={style.icons}>
                    <FaLock size={20} color="red" />
                    <FaLockOpen size={20} color="gray" />
                </div>
            )}
            {selected_store && <div>{selected_store.name}</div>}
        </div>
    );
};

export default memo(SelectedStore);
