import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__basic_info, set__is_basic_info } from '@src/redux/slice/Product_Create';

const Infor1 = () => {
    const dispatch = useDispatch<AppDispatch>();

    const create_status: 'begin' | 'end' = useSelector((state: RootState) => state.Product_Create_Slice.create_status);

    const [name, set__name] = useState<string>('');
    const [description, set__description] = useState<string>('');

    useEffect(() => {
        if (create_status === 'begin') {
            if (name.trim().length === 0 || description.trim().length === 0) {
                dispatch(
                    global_set__data__toast_message({
                        type: messageType_enum.WARN,
                        message: 'Tên và mô tả không được để trống !',
                    })
                );
                return;
            }
            dispatch(set__basic_info({ name, description }));
            dispatch(set__is_basic_info(true));
        }
    }, [create_status, dispatch, name, description]);

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
                    <input
                        placeholder="Nhập tên sản phẩm ..."
                        value={name}
                        onChange={(e) => set__name(e.target.value)}
                    />
                </div>
            </div>
            <div className={style.description}>
                <div>
                    Mô tả ngắn <span>*</span>
                </div>
                <div>
                    <input
                        placeholder="Nhập mô tả ngắn ..."
                        value={description}
                        onChange={(e) => set__description(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default memo(Infor1);
