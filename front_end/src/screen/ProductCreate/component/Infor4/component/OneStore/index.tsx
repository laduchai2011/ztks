import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
// import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '@src/redux';
// import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { useLazy_get_Store_By_Id_Query } from '@src/redux/query/shop_RTK';
import { Store_Field } from '@src/data_struct/shop';

const OneStore: FC<{
    id: string;
    set__selected_store: React.Dispatch<React.SetStateAction<Store_Field | null>>;
}> = ({ id, set__selected_store }) => {
    const [store, set__store] = useState<Store_Field | undefined>(undefined);

    const [get_Store_By_Id] = useLazy_get_Store_By_Id_Query();

    useEffect(() => {
        get_Store_By_Id({ id: id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__store(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id, get_Store_By_Id]);

    const handle_Select = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (!store) return;
        set__selected_store(store);
    };

    return (
        <div className={style.parent} onClick={(e) => handle_Select(e)}>
            <div>
                <div>{store?.name}</div>
                <div>{store?.description}</div>
            </div>
            <FaRegEye size={18} />
        </div>
    );
};

export default memo(OneStore);
