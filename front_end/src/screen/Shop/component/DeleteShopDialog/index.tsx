import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, DELETE } from '@src/const/text';
import { Delete_Shop_Body_Field } from '@src/data_struct/shop/body';
import { use_delete_Shop_Mutation } from '@src/redux/query/shop_RTK';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_delete_shop, set__deleted_shop } from '@src/redux/slice/Shop';
import { Shop_Field } from '@src/data_struct/shop';

const DeleteShopDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const is_show_delete_shop: boolean = useSelector((state: RootState) => state.Shop_Slice.is_show_delete_shop);
    const selected_delete_shop: Shop_Field | undefined = useSelector(
        (state: RootState) => state.Shop_Slice.selected_delete_shop
    );

    const [name, set__name] = useState<string>('');

    const [delete_Shop] = use_delete_Shop_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_delete_shop) {
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
    }, [is_show_delete_shop]);

    const handle_Close = () => {
        dispatch(set__is_show_delete_shop(false));
    };

    const handle_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__name(value);
    };

    const handle_Delete = () => {
        if (!selected_delete_shop) return;

        const name_t = name.trim();
        if (name_t !== selected_delete_shop.name) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Tên cửa hàng không đúng !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }
        const body: Delete_Shop_Body_Field = {
            id: selected_delete_shop.id,
            account_id: selected_delete_shop.account_id,
        };
        dispatch(global_set__is_loading(true));
        delete_Shop(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__deleted_shop(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Xóa cửa hàng thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                    dispatch(set__is_show_delete_shop(false));
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Xóa cửa hàng không thành công !',
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
                    <div>Xóa cửa hàng</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}>
                    <div>
                        <div>{`Hãy nhập đúng tên cửa hàng để xóa (${selected_delete_shop?.name})`}</div>
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

export default memo(DeleteShopDialog);
