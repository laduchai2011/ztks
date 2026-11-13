import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
// import { global_set__data__toast_message } from '@src/redux/slice/Global';
import TextEditor from '@src/component/TextEditor';
import { set__detail_info, set__is_detail_info } from '@src/redux/slice/Product_Code_Create';

const Infor2 = () => {
    const dispatch = useDispatch<AppDispatch>();

    const create_status: 'begin' | 'end' = useSelector(
        (state: RootState) => state.Product_Code_Create_Slice.create_status
    );

    const [describe, set__describe] = useState<string>('');

    useEffect(() => {
        if (create_status === 'begin') {
            dispatch(set__detail_info({ detail: describe }));
            dispatch(set__is_detail_info(true));
        }
    }, [create_status, dispatch, describe]);

    const handle_Describe = (value: string) => {
        set__describe(value);
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
                    <TextEditor onChange={(value) => handle_Describe(value)} />
                </div>
            </div>
        </div>
    );
};

export default memo(Infor2);
