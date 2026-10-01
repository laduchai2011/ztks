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
import { set__is_show_delete_shop } from '@src/redux/slice/Shop';

const DeleteShopDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const is_show_delete_shop: boolean = useSelector((state: RootState) => state.Shop_Slice.is_show_delete_shop);

    const [create_shop, set__create_shop] = useState<Delete_Shop_Body_Field>({
        id: '',
        account_id: '',
    });

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

    const handle_Create = () => {
        // const body: Create_Shop_Body_Field = {
        //     name: create_shop.name.trim(),
        //     description: create_shop.description.trim(),
        //     content: create_shop.content.trim(),
        //     address: create_shop.address.trim(),
        //     phone: create_shop.phone.trim(),
        //     account_id: '',
        // };
        // dispatch(global_set__is_loading(true));
        // create_Shop(body)
        //     .then((res) => {
        //         const res_data = res.data;
        //         if (res_data?.is_success && res_data.data) {
        //             dispatch(set__new_shop(res_data.data));
        //             dispatch(
        //                 global_set__data__toast_message({
        //                     message: 'Tạo cửa hàng mới thành công !',
        //                     type: messageType_enum.SUCCESS,
        //                 })
        //             );
        //             dispatch(set__is_show_create_shop(false));
        //         } else {
        //             dispatch(
        //                 global_set__data__toast_message({
        //                     message: 'Tạo cửa hàng mới không thành công !',
        //                     type: messageType_enum.WARN,
        //                 })
        //             );
        //         }
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //         dispatch(
        //             global_set__data__toast_message({
        //                 message: 'Đã có lỗi xảy ra !',
        //                 type: messageType_enum.ERROR,
        //             })
        //         );
        //     })
        //     .finally(() => {
        //         dispatch(global_set__is_loading(false));
        //     });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>Xóa cửa hàng</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}></div>
            </div>
        </div>
    );
};

export default memo(DeleteShopDialog);
