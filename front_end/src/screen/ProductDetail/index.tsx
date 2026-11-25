import { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { route_enum } from '@src/router/type';
// import { select_enum } from '@src/router/type';
import GlobalLoading from '@src/Global/GlobalLoading';
import GlobalToastMessage from '@src/Global/GlobalToastMessage';
import DialogPlayImage from '@src/component/DialogPlayImage';
import DialogPlayVideo from '@src/component/DialogPlayVideo';
import Header from './component/Header';
import Infor1 from './component/Infor1';
import Infor2 from './component/Infor2';
import Infor3 from './component/Infor3';
import DeleteDialog from './component/DeleteDialog';
import { useLazy_get_Product_By_Id_Query } from '@src/redux/query/product_RTK';
import { Image_Field } from '@src/data_struct/image';
import { Video_Field } from '@src/data_struct/video';
import { set__product, set__is_show_image, set__is_show_video } from '@src/redux/slice/Product_Detail';
import { handleSrcImage } from '@src/utility/string';

const ProductDetail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const my_id = sessionStorage.getItem('myId');
    const { id } = useParams<{ id: string }>();

    const is_show_image: boolean = useSelector((state: RootState) => state.Product_Detail_Slice.is_show_image);
    const showed_images: Image_Field[] = useSelector((state: RootState) => state.Product_Detail_Slice.showed_images);
    const is_show_video: boolean = useSelector((state: RootState) => state.Product_Detail_Slice.is_show_video);
    const showed_videos: Video_Field[] = useSelector((state: RootState) => state.Product_Detail_Slice.showed_videos);

    const [image_urls, set__image_urls] = useState<string[]>([]);

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }

        return () => {
            dispatch(
                global_set__data__toast_message({
                    message: '',
                    type: undefined,
                })
            );
        };
    }, [navigate, my_id, dispatch]);

    useEffect(() => {
        const urls: string[] = [];
        for (let i: number = 0; i < showed_images.length; i++) {
            urls.push(handleSrcImage(showed_images[i].url));
        }
        set__image_urls(urls);
    }, [showed_images]);

    const [get_Product_By_Id] = useLazy_get_Product_By_Id_Query();

    useEffect(() => {
        if (!id) return;
        get_Product_By_Id({ id: id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__product(res_data.data));
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch, get_Product_By_Id, id]);

    return (
        <div className={style.parent}>
            <div>
                <Header />
                <Infor1 />
                <Infor2 />
                <Infor3 />
            </div>
            <div>
                <GlobalLoading />
                <GlobalToastMessage />
                <DialogPlayImage
                    isShow={is_show_image}
                    data={image_urls}
                    onClose={() => dispatch(set__is_show_image(false))}
                />
                <DialogPlayVideo
                    isShow={is_show_video}
                    data={showed_videos}
                    onClose={() => dispatch(set__is_show_video(false))}
                />
                <DeleteDialog />
            </div>
        </div>
    );
};

export default ProductDetail;
