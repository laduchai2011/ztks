import { memo, useEffect } from 'react';
import style from './style.module.scss';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
// import { route_enum } from '@src/router/type';
import { HiOutlineCube } from 'react-icons/hi';
import { CREATE_PRODUCT } from '@src/const/text';
import {
    set__create_status,
    set__is_basic_infor,
    set__is_detail_infor,
    set__is_product_code_infor,
    set__is_store_infor,
    set__is_amount_infor,
    set__is_price_infor,
    set__is_upload_images,
    set__is_upload_videos,
} from '@src/redux/slice/Product_Create';
import { Account_Information_Field, account_type_enum } from '@src/data_struct/account';
import { Create_Product_Body_Field } from '@src/data_struct/product/body';
import { use_create_Product_Mutation } from '@src/redux/query/product_RTK';

const Header = () => {
    // const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const [create_Product] = use_create_Product_Mutation();

    const create_status: 'begin' | 'end' = useSelector((state: RootState) => state.Product_Create_Slice.create_status);

    const is_basic_infor: boolean = useSelector((state: RootState) => state.Product_Create_Slice.is_basic_infor);
    const is_detail_infor: boolean = useSelector((state: RootState) => state.Product_Create_Slice.is_detail_infor);
    const is_amount_infor: boolean = useSelector((state: RootState) => state.Product_Create_Slice.is_amount_infor);
    const is_store_infor: boolean = useSelector((state: RootState) => state.Product_Create_Slice.is_store_infor);
    const is_product_code_infor: boolean = useSelector(
        (state: RootState) => state.Product_Create_Slice.is_product_code_infor
    );
    const is_price_infor: boolean = useSelector((state: RootState) => state.Product_Create_Slice.is_price_infor);
    const is_upload_images: boolean = useSelector((state: RootState) => state.Product_Create_Slice.is_upload_images);
    const is_upload_videos: boolean = useSelector((state: RootState) => state.Product_Create_Slice.is_upload_videos);

    const { name, description } = useSelector((state: RootState) => state.Product_Create_Slice.basic_infor);
    const { detail } = useSelector((state: RootState) => state.Product_Create_Slice.detail_infor);
    const { amount } = useSelector((state: RootState) => state.Product_Create_Slice.amount_infor);
    const { store } = useSelector((state: RootState) => state.Product_Create_Slice.store_infor);
    const { product_code } = useSelector((state: RootState) => state.Product_Create_Slice.product_code_infor);
    const { price, is_compelled_price } = useSelector((state: RootState) => state.Product_Create_Slice.price_infor);
    const { urls: image_urls } = useSelector((state: RootState) => state.Product_Create_Slice.upload_images);
    const { urls: video_urls } = useSelector((state: RootState) => state.Product_Create_Slice.upload_videos);

    useEffect(() => {
        // console.log('create_status', create_status);
        // console.log('is_basic_infor', is_basic_infor);
        // console.log('is_detail_infor', is_detail_infor);
        // console.log('is_amount_infor', is_amount_infor);
        // console.log('is_store_infor', is_store_infor);
        // console.log('is_product_code_infor', is_product_code_infor);
        // console.log('is_price_infor', is_price_infor);
        // console.log('is_upload_images', is_upload_images);
        // console.log('is_upload_videos', is_upload_videos);

        if (
            create_status === 'begin' &&
            is_basic_infor &&
            is_detail_infor &&
            is_amount_infor &&
            is_store_infor &&
            is_product_code_infor &&
            is_price_infor &&
            is_upload_images &&
            is_upload_videos
        ) {
            console.log('create_Product', 0);

            if (
                !(
                    account_information?.account_id === account_information?.added_by_id &&
                    account_information?.account_type === account_type_enum.ADMIN
                )
            ) {
                dispatch(
                    global_set__data__toast_message({
                        message: 'Bạn không phải admin',
                        type: messageType_enum.WARN,
                    })
                );
                return;
            }

            console.log('create_Product', 1);

            if (name.trim().length === 0) {
                dispatch(
                    global_set__data__toast_message({
                        message: 'Tên không được để trống',
                        type: messageType_enum.WARN,
                    })
                );
                return;
            }

            if (description.trim().length === 0) {
                dispatch(
                    global_set__data__toast_message({
                        message: 'Mô tả ngắn không được để trống',
                        type: messageType_enum.WARN,
                    })
                );
                return;
            }

            if (!product_code) {
                dispatch(
                    global_set__data__toast_message({
                        message: 'Vui lòng chọn ma sản phẩm',
                        type: messageType_enum.WARN,
                    })
                );
                return;
            }

            if (!store) {
                dispatch(
                    global_set__data__toast_message({
                        message: 'Vui lòng chọn gian hàng',
                        type: messageType_enum.WARN,
                    })
                );
                return;
            }

            dispatch(global_set__is_loading(true));
            const create_product_body: Create_Product_Body_Field = {
                name: name,
                description: description,
                detail: detail,
                quantity: amount,
                is_compelled_price: is_compelled_price,
                unit_price: price,
                store_id: store.id,
                product_code_id: product_code.id,
                account_id: account_information.account_id,
                images: image_urls,
                videos: video_urls,
            };
            console.log('create_Product', 2);
            create_Product(create_product_body)
                .then((res) => {
                    const res_data = res.data;
                    if (res_data) {
                        dispatch(
                            global_set__data__toast_message({
                                message: 'Tạo sản phẩm thành công',
                                type: messageType_enum.SUCCESS,
                            })
                        );
                    } else {
                        dispatch(
                            global_set__data__toast_message({
                                message: 'Tạo sản phẩm thất bại',
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
                    dispatch(set__is_basic_infor(false));
                    dispatch(set__is_detail_infor(false));
                    dispatch(set__is_upload_images(false));
                    dispatch(set__is_upload_videos(false));
                    dispatch(set__is_product_code_infor(false));
                    dispatch(set__is_store_infor(false));
                    dispatch(set__is_amount_infor(false));
                    dispatch(set__is_price_infor(false));
                    dispatch(set__create_status('end'));
                });
        }
    }, [
        dispatch,
        account_information,
        create_Product,
        create_status,
        is_basic_infor,
        is_detail_infor,
        is_amount_infor,
        is_compelled_price,
        is_price_infor,
        is_product_code_infor,
        is_store_infor,
        is_upload_images,
        is_upload_videos,
        name,
        description,
        detail,
        amount,
        price,
        product_code,
        store,
        image_urls,
        video_urls,
    ]);

    const handle_Begin_Create = () => {
        dispatch(set__create_status('begin'));
    };

    return (
        <div className={style.parent}>
            <div>
                <HiOutlineCube />
                <span>{CREATE_PRODUCT}</span>
            </div>
            <div>
                <div onClick={() => handle_Begin_Create()}>Tạo</div>
            </div>
        </div>
    );
};

export default memo(Header);
