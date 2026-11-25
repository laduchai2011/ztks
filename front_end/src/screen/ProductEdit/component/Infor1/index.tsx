import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
// import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { Product_Field } from '@src/data_struct/product';
import { set__is_basic_infor, set__basic_infor } from '@src/redux/slice/Product_Edit';

const Infor1 = () => {
    const dispatch = useDispatch<AppDispatch>();

    const product: Product_Field | undefined = useSelector((state: RootState) => state.Product_Edit_Slice.product);
    const create_status: 'begin' | 'end' = useSelector((state: RootState) => state.Product_Edit_Slice.create_status);

    const [name, set__name] = useState<string>('');
    const [description, set__description] = useState<string>('');

    useEffect(() => {
        if (!product) return;
        set__name(product.name);
        set__description(product.description);
    }, [product]);

    useEffect(() => {
        if (create_status === 'begin') {
            dispatch(set__basic_infor({ name: name, description: description }));
            dispatch(set__is_basic_infor(true));
        }
    }, [create_status, dispatch, name, description]);

    const handle_Change_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__name(e.target.value);
    };

    const handle_Change_Description = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__description(e.target.value);
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div />
                <div>Thông tin cơ bản</div>
            </div>
            <div className={style.name}>
                <div>
                    Tên sản phẩm <span>*</span>
                </div>
                <div>
                    <input value={name} onChange={(e) => handle_Change_Name(e)} placeholder="Nhập tên sản phẩm ..." />
                </div>
            </div>
            <div className={style.description}>
                <div>
                    Mô tả ngắn <span>*</span>
                </div>
                <div>
                    <input
                        value={description}
                        onChange={(e) => handle_Change_Description(e)}
                        placeholder="Nhập mô tả ngắn ..."
                    />
                </div>
            </div>
        </div>
    );
};

export default memo(Infor1);
