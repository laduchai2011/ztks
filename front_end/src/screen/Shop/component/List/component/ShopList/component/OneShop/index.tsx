import { FC, memo } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { Shop_Field } from '@src/data_struct/shop';
import {
    set__selected_shop,
    set__is_show_edit_shop,
    set__selected_edit_shop,
    set__is_show_delete_shop,
    set__selected_delete_shop,
} from '@src/redux/slice/Shop';

const OneShop: FC<{ data: Shop_Field; index: number }> = ({ data, index }) => {
    const dispatch = useDispatch<AppDispatch>();

    const is_selected: boolean | undefined = useSelector(
        (state: RootState) => state.Shop_Slice.selected_shop?.id === data.id
    );

    const handle_Selected_Class = () => {
        if (is_selected) {
            return style.selected;
        }
        return;
    };

    const handle_Selected = () => {
        dispatch(set__selected_shop(data));
    };

    const handle_Open_Edit = () => {
        dispatch(set__selected_edit_shop(data));
        dispatch(set__is_show_edit_shop(true));
    };

    const handle_Open_Delete = () => {
        dispatch(set__selected_delete_shop(data));
        dispatch(set__is_show_delete_shop(true));
    };

    return (
        <div className={`${style.parent} ${handle_Selected_Class()}`} onClick={() => handle_Selected()}>
            <div className={style.infor1}>
                <div className={style.index}>{index + 1}</div>
                <div className={style.icons}>
                    <CiEdit onClick={() => handle_Open_Edit()} size={20} color="green" />
                    <MdDeleteOutline onClick={() => handle_Open_Delete()} size={20} color="red" />
                </div>
            </div>
            <div className={style.infor2}>
                <div>
                    <div className={style.name}>{data.name}</div>
                    <div className={style.des}>{data.description}</div>
                    <div className={style.content}>{data.content}</div>
                    <div className={style.address}>{data.address}</div>
                    <div className={style.phone}>{data.phone}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(OneShop);
