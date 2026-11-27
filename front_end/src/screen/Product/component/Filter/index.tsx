import { memo, useEffect, useState, useRef } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
// import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { IoCloseOutline } from 'react-icons/io5';
import { IoMdAdd } from 'react-icons/io';
import { CREATE_PRODUCT } from '@src/const/text';
import { route_enum } from '@src/router/type';
import { useLazy_product_Search_Query } from '@src/redux/query/product_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { set__searched_product_ids, set__filter } from '@src/redux/slice/Product';

const Filter = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const { is_delete } = useSelector((state: RootState) => state.Product_Slice.filter);

    // const searched_product_ids: string[] = useSelector((state: RootState) => state.Product_Slice.searched_product_ids);

    const [search_text_product, set__search_text_product] = useState<string>('');

    const [product_Search] = useLazy_product_Search_Query();

    const timeout_search_product = useRef<any>(null);
    useEffect(() => {
        if (search_text_product.trim().length === 0) {
            dispatch(set__searched_product_ids([]));
            return;
        }

        clearTimeout(timeout_search_product.current);
        timeout_search_product.current = setTimeout(() => {
            if (!account_information) return;
            product_Search({
                from: 0,
                size: 20,
                search_content: search_text_product,
                account_id: account_information.added_by_id || '', // Replace with actual account ID
            })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        const id_array: string[] = [];
                        for (let i: number = 0; i < res_data.data.hits.length; i++) {
                            id_array.push(res_data.data.hits[i]._id);
                        }

                        dispatch(set__searched_product_ids(id_array));
                    } else {
                        dispatch(set__searched_product_ids([]));
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }, 1000);
    }, [dispatch, search_text_product, account_information, product_Search]);

    const handle_Go_To_Create_Product = () => {
        navigate(route_enum.CREATE_PRODUCT);
    };

    const handle_Product_Search = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Call the API to search for product codes

        set__search_text_product(value);
    };

    const handle_Filter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        dispatch(set__filter({ is_delete: checked }));
    };

    const clear_Search_Text = () => {
        set__search_text_product('');
    };

    return (
        <div className={style.parent}>
            <div className={style.options}>
                <input checked={is_delete} onChange={(e) => handle_Filter(e)} type="checkbox" />
                <span>Đã xóa</span>
            </div>
            <div className={style.search}>
                <div>
                    <input
                        value={search_text_product}
                        onChange={(e) => handle_Product_Search(e)}
                        placeholder="Tìm kiếm"
                    />
                    {search_text_product.length > 0 && <IoCloseOutline onClick={() => clear_Search_Text()} />}
                </div>
            </div>
            <div className={style.btn}>
                <div onClick={() => handle_Go_To_Create_Product()}>
                    <IoMdAdd />
                    <div>{CREATE_PRODUCT}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(Filter);
