import { memo } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { GiNotebook } from 'react-icons/gi';
import { Product_Field } from '@src/data_struct/product';

const Infor2 = () => {
    const product: Product_Field | undefined = useSelector((state: RootState) => state.Product_Detail_Slice.product);

    if (!product) return;
    return (
        <div className={style.parent}>
            <div className={style.infor31}>
                <div>
                    <div>
                        <GiNotebook />
                    </div>
                </div>
                <div>Thông tin chi tiết</div>
            </div>
            <div className={style.infor32}>
                <div dangerouslySetInnerHTML={{ __html: product.detail }} />
            </div>
        </div>
    );
};

export default memo(Infor2);
