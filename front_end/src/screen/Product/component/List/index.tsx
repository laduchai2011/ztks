import { memo, useEffect, useRef, useCallback } from 'react';
import style from './style.module.scss';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
// import { global_set__data__toast_message } from '@src/redux/slice/Global';
import OneProduct from './component/OneProduct';
import OneProductWithSearch from './component/OneProductWithSearch';
import { useLazy_get_Random_Products_Query } from '@src/redux/query/product_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Product_Field } from '@src/data_struct/product';
import { useInfiniteScroll } from '@src/component/Hook/load_More/useInfiniteScroll';
import { useLoadMore } from '@src/component/Hook/load_More/useLoadMore';

const List = () => {
    // const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const searched_product_ids: string[] = useSelector((state: RootState) => state.Product_Slice.searched_product_ids);

    const seed_ref = useRef<string>(crypto.randomUUID());

    const [get_Random_Products] = useLazy_get_Random_Products_Query();

    const account_id = account_information?.added_by_id;

    const fetchProduct = useCallback(
        async (cursor: string | null) => {
            if (!account_id) {
                throw new Error('Account ID is not available');
            }

            try {
                const res = await get_Random_Products({
                    account_id,
                    seed: seed_ref.current,
                    limit: 20,
                    cursor,
                });

                const res_data = res.data;

                console.log('get_Random_Products', res_data);

                if (res_data?.is_success && res_data.data) {
                    return res_data.data;
                }

                throw new Error(res_data?.message || 'API returned unsuccessful response');
            } catch (error) {
                console.error('Fetch random products error:', error);
                throw error;
            }
        },
        [get_Random_Products, account_id]
    );

    const { items, hasMore, isLoading, loadMore } = useLoadMore<Product_Field>({
        fetchData: fetchProduct,
    });

    useEffect(() => {
        console.log('items', items);
    }, [items]);

    const { lastElementRef } = useInfiniteScroll({
        loadMore,
        hasMore,
        isLoading,
        threshold: 300,
    });

    useEffect(() => {
        if (!account_id) return;
        void loadMore();
    }, [loadMore, account_id]);

    const list_product = items.map((item, index) => {
        return <OneProduct key={index} ref={index === items.length - 1 ? lastElementRef : undefined} data={item} />;
    });

    const list_product_search = searched_product_ids.map((item, index) => {
        return <OneProductWithSearch key={index} id={item} />;
    });

    const list_final = searched_product_ids.length === 0 ? list_product : list_product_search;

    return <div className={style.parent}>{list_final}</div>;
};

export default memo(List);
