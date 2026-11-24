import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
// import { global_set__data__toast_message } from '@src/redux/slice/Global';
import TextEditor from '@src/component/TextEditor';
import { Product_Field } from '@src/data_struct/product';

const Infor2 = () => {
    const dispatch = useDispatch<AppDispatch>();

    const product: Product_Field | undefined = useSelector((state: RootState) => state.Product_Edit_Slice.product);

    const [detail, set__detail] = useState<string>('');

    useEffect(() => {
        if (!product) return;
        set__detail(product.detail);
    }, [product]);

    const handle_Change_Detail = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__detail(e.target.value);
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div />
                <div>Chi tiết sản phẩm</div>
            </div>
            <div className={style.detail}>
                <div>
                    Mô tả chi tiết <span>*</span>
                </div>
                <div>
                    <TextEditor value={product?.detail} />
                </div>
            </div>
        </div>
    );
};

export default memo(Infor2);
