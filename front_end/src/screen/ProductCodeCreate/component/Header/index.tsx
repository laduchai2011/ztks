import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
// import { route_enum } from '@src/router/type';
import { HiOutlineCube } from 'react-icons/hi';
import { CREATE_PRODUCT_CODE } from '@src/const/text';
import { select_enum } from '@src/router/type';
import { set__create_status } from '@src/redux/slice/Product_Code_Create';
import { Create_Product_Code_Body_Field } from '@src/data_struct/product/body';
import { use_create_Product_Code_Mutation } from '@src/redux/query/product_RTK';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [create_Product_Code] = use_create_Product_Code_Mutation();

    const create_status: 'begin' | 'end' = useSelector(
        (state: RootState) => state.Product_Code_Create_Slice.create_status
    );

    const is_basic_info: boolean = useSelector((state: RootState) => state.Product_Code_Create_Slice.is_basic_info);
    const is_detail_info: boolean = useSelector((state: RootState) => state.Product_Code_Create_Slice.is_detail_info);
    const is_upload_images: boolean = useSelector(
        (state: RootState) => state.Product_Code_Create_Slice.is_upload_images
    );
    const is_upload_videos: boolean = useSelector(
        (state: RootState) => state.Product_Code_Create_Slice.is_upload_videos
    );

    const { name, description } = useSelector((state: RootState) => state.Product_Code_Create_Slice.basic_info);
    const { detail } = useSelector((state: RootState) => state.Product_Code_Create_Slice.detail_info);
    const { urls: image_urls } = useSelector((state: RootState) => state.Product_Code_Create_Slice.upload_images);
    const { urls: video_urls } = useSelector((state: RootState) => state.Product_Code_Create_Slice.upload_videos);

    useEffect(() => {
        if (create_status === 'begin' && is_basic_info && is_detail_info && is_upload_images && is_upload_videos) {
            const create_product_code_body: Create_Product_Code_Body_Field = {
                name: name,
                description: description,
                detail: detail,
                account_id: '',
                images: image_urls,
                videos: video_urls,
            };
            create_Product_Code(create_product_code_body)
                .then((res) => {
                    const res_data = res.data;
                    if (res_data) {
                        dispatch(
                            global_set__data__toast_message({
                                message: 'Tạo mã sản phẩm thành công',
                                type: messageType_enum.SUCCESS,
                            })
                        );
                    } else {
                        dispatch(
                            global_set__data__toast_message({
                                message: 'Tạo mã sản phẩm thất bại',
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
                    dispatch(set__create_status('end'));
                });
        }
    }, [
        dispatch,
        create_Product_Code,
        create_status,
        is_basic_info,
        is_detail_info,
        is_upload_images,
        is_upload_videos,
        name,
        description,
        detail,
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
                <span>{CREATE_PRODUCT_CODE}</span>
            </div>
            <div>
                <div onClick={() => handle_Begin_Create()}>Tạo</div>
            </div>
        </div>
    );
};

export default memo(Header);
