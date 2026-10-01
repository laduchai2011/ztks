import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, DELETE } from '@src/const/text';
import { Delete_Depot_Body_Field } from '@src/data_struct/shop/body';
import { use_delete_Depot_Mutation } from '@src/redux/query/shop_RTK';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_delete_depot, set__deleted_depot } from '@src/redux/slice/Shop';
import { Depot_Field } from '@src/data_struct/shop';

const DeleteDepotDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const is_show_delete_depot: boolean = useSelector((state: RootState) => state.Shop_Slice.is_show_delete_depot);
    const selected_delete_depot: Depot_Field | undefined = useSelector(
        (state: RootState) => state.Shop_Slice.selected_delete_depot
    );

    const [name, set__name] = useState<string>('');

    const [delete_Depot] = use_delete_Depot_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_delete_depot) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [is_show_delete_depot]);

    const handle_Close = () => {
        dispatch(set__is_show_delete_depot(false));
    };

    const handle_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__name(value);
    };

    const handle_Delete = () => {
        if (!selected_delete_depot) return;

        const name_t = name.trim();
        if (name_t !== selected_delete_depot.name) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Tên kho không đúng !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }
        const body: Delete_Depot_Body_Field = {
            id: selected_delete_depot.id,
            account_id: '',
        };
        dispatch(global_set__is_loading(true));
        delete_Depot(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__deleted_depot(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Xóa kho thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                    dispatch(set__is_show_delete_depot(false));
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Xóa kho không thành công !',
                            type: messageType_enum.WARN,
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    global_set__data__toast_message({
                        message: 'Đã có lỗi xảy ra !',
                        type: messageType_enum.ERROR,
                    })
                );
            })
            .finally(() => {
                dispatch(global_set__is_loading(false));
            });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>Xóa kho</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}>
                    <div>
                        <div>{`Hãy nhập đúng tên kho để xóa (${selected_delete_depot?.name})`}</div>
                        <div>
                            <input value={name} onChange={(e) => handle_Name(e)} placeholder="Tên cửa hàng !" />
                        </div>
                        <div>
                            <div onClick={() => handle_Delete()}>{DELETE}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteDepotDialog);
