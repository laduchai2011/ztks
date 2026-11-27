import { memo, useEffect, useRef, useCallback } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { v7 as uuidv7 } from 'uuid';
import OneProduct from './component/OneProduct';
import OneProductWithSearch from './component/OneProductWithSearch';
import { useLazy_get_Random_Products_Query } from '@src/redux/query/product_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Product_Field } from '@src/data_struct/product';
import { useInfiniteScroll } from '@src/component/Hook/load_More/useInfiniteScroll';
import { useLoadMore } from '@src/component/Hook/load_More/useLoadMore';

const List = () => {
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const searched_product_ids: string[] = useSelector((state: RootState) => state.Product_Slice.searched_product_ids);
    const { is_delete } = useSelector((state: RootState) => state.Product_Slice.filter);

    // Giữ seed ổn định trong suốt vòng đời component
    const seed_ref = useRef<string>(uuidv7());

    const initializedAccountRef = useRef<string | null>(null);
    const initializedIsDeleteRef = useRef<boolean | null>(null);

    const [get_Random_Products] = useLazy_get_Random_Products_Query();

    const account_id = account_information?.added_by_id;

    // Fetch dữ liệu
    const fetchProduct = useCallback(
        async (cursor: string | null) => {
            if (!account_id) {
                throw new Error('Account ID is not available');
            }

            const res = await get_Random_Products({
                account_id,
                seed: seed_ref.current,
                is_delete: is_delete,
                limit: 20,
                cursor,
            });

            const res_data = res.data;

            if (res_data?.is_success && res_data.data) {
                return res_data.data;
            }

            throw new Error(res_data?.message || 'API returned unsuccessful response');
        },
        [get_Random_Products, account_id, is_delete]
    );

    // Quản lý danh sách
    const { items, hasMore, isLoading, loadMore, refresh, clear } = useLoadMore<Product_Field>({
        fetchData: fetchProduct,
    });

    // Infinite scroll sử dụng window viewport
    const { lastElementRef } = useInfiniteScroll({
        loadMore,
        hasMore,
        isLoading,
        root: null,
        threshold: 300,
    });

    // Khởi tạo dữ liệu khi account thay đổi
    useEffect(() => {
        if (!account_id) {
            initializedAccountRef.current = null;
            initializedIsDeleteRef.current = null;
            clear();
            return;
        }

        const accountChanged = initializedAccountRef.current !== account_id;
        const lockChanged = initializedIsDeleteRef.current !== is_delete;

        if (accountChanged || lockChanged) {
            initializedAccountRef.current = account_id;
            initializedIsDeleteRef.current = is_delete;

            void refresh();
        }
    }, [account_id, is_delete, refresh, clear]);

    // Danh sách sản phẩm ngẫu nhiên
    const list_product = items.map((item, index) => (
        <OneProduct key={item.id} ref={index === items.length - 1 ? lastElementRef : undefined} data={item} />
    ));

    // Danh sách sản phẩm tìm kiếm
    const list_product_search = searched_product_ids.map((item) => <OneProductWithSearch key={item} id={item} />);

    const list_final = searched_product_ids.length === 0 ? list_product : list_product_search;

    return (
        <div className={style.parent}>
            {list_final}

            {isLoading && <div className={style.loading}>Đang tải sản phẩm...</div>}

            {!hasMore && items.length > 0 && <div className={style.end}>Đã tải hết sản phẩm</div>}

            {!isLoading && items.length === 0 && <div className={style.empty}>Không có sản phẩm</div>}
        </div>
    );
};

export default memo(List);
