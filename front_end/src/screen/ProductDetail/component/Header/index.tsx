import { memo } from 'react';
import style from './style.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { route_enum } from '@src/router/type';
import { HiOutlineCube } from 'react-icons/hi';
import { MdDeleteForever } from 'react-icons/md';
import { PRODUCT_DETAIL } from '@src/const/text';
import { set__is_show_delete_product_dialog, set__product } from '@src/redux/slice/Product_Detail';
import { Account_Information_Field } from '@src/data_struct/account';
import { Product_Field } from '@src/data_struct/product';
import { use_re_Delete_Product_Mutation } from '@src/redux/query/product_RTK';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const product: Product_Field | undefined = useSelector((state: RootState) => state.Product_Detail_Slice.product);

    const [re_Delete_Product] = use_re_Delete_Product_Mutation();

    const handle_Go_To_Edit_Product = () => {
        navigate(route_enum.EDIT_PRODUCT + '/' + `${id}`);
    };

    const handle_Show_Delete_Dialog = () => {
        dispatch(set__is_show_delete_product_dialog(true));
    };

    const handle_Re_Delete_Dialog = () => {
        if (!product) return;

        if (!(product.account_id === account_information?.account_id)) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Bạn không có quyền này',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        dispatch(global_set__is_loading(true));
        re_Delete_Product({ id: product.id, account_id: product.account_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__product(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Khôi phục thành công',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Khôi phục thất bại',
                            type: messageType_enum.ERROR,
                        })
                    );
                }
            })
            .catch((err) => {
                console.log('err', err);
                dispatch(
                    global_set__data__toast_message({
                        message: 'Đã có lỗi xảy ra',
                        type: messageType_enum.ERROR,
                    })
                );
            })
            .finally(() => {
                dispatch(global_set__is_loading(false));
            });
    };

    return (
        <div className={style.parent}>
            <div>
                <HiOutlineCube />
                <span>{PRODUCT_DETAIL}</span>
            </div>
            <div>
                {product?.is_delete === false && (
                    <div className={style.edit} onClick={() => handle_Go_To_Edit_Product()}>
                        Chỉnh sửa
                    </div>
                )}
                {product?.is_delete === true && (
                    <div className={style.re_delete} onClick={() => handle_Re_Delete_Dialog()}>
                        Khôi phục
                    </div>
                )}
                {product?.is_delete === false && (
                    <MdDeleteForever onClick={() => handle_Show_Delete_Dialog()} size={30} color="red" />
                )}
            </div>
        </div>
    );
};

export default memo(Header);
