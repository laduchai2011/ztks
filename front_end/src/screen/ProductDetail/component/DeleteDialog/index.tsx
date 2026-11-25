import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, DELETE } from '@src/const/text';
import { Product_Field } from '@src/data_struct/product';
import { Delete_Product_Body_Field } from '@src/data_struct/product/body';
import { use_delete_Product_Mutation } from '@src/redux/query/product_RTK';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_delete_product_dialog, set__product } from '@src/redux/slice/Product_Detail';

const DeleteDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const is_show_delete_product_dialog: boolean = useSelector(
        (state: RootState) => state.Product_Detail_Slice.is_show_delete_product_dialog
    );
    const product: Product_Field | undefined = useSelector((state: RootState) => state.Product_Detail_Slice.product);

    const [name, set__name] = useState<string>('');

    const [delete_Product] = use_delete_Product_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_delete_product_dialog) {
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
    }, [is_show_delete_product_dialog]);

    const handle_Close = () => {
        dispatch(set__is_show_delete_product_dialog(false));
    };

    const handle_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__name(value);
    };

    const handle_Delete = () => {
        if (!product) return;
        const name_t = name.trim();
        if (name_t !== product.name) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Tên sản phẩm không đúng !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }
        const body: Delete_Product_Body_Field = {
            id: product.id,
            account_id: product.account_id,
        };
        dispatch(global_set__is_loading(true));
        delete_Product(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__product(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Xóa sản phẩm thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                    dispatch(set__is_show_delete_product_dialog(false));
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Xóa sản phẩm không thành công !',
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
                    <div>Xóa sản phẩm</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}>
                    <div>
                        <div>{`Hãy nhập đúng tên sản phẩm để xóa (${product?.name})`}</div>
                        <div>
                            <input value={name} onChange={(e) => handle_Name(e)} placeholder="Tên sản phẩm !" />
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

export default memo(DeleteDialog);
