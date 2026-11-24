import { memo, useRef, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
// import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { route_enum } from '@src/router/type';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import OneProductCode from './component/OneProductCode';
import OneStore from './component/OneStore';
import { useLazy_product_Code_Search_Query } from '@src/redux/query/product_RTK';
import { useLazy_store_Search_Query } from '@src/redux/query/shop_RTK';
import { useLazy_get_My_Shops_Query, useLazy_get_My_Depots_Query } from '@src/redux/query/shop_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Product_Code_Field } from '@src/data_struct/product';
import { Shop_Field, Depot_Field, Store_Field } from '@src/data_struct/shop';
import { SEE_MORE } from '@src/const/text';
import {
    set__is_product_code_infor,
    set__product_code_infor,
    set__is_store_infor,
    set__store_infor,
} from '@src/redux/slice/Product_Create';
import { Product_Field } from '@src/data_struct/product';
import {
    useLazy_get_Store_By_Id_Query,
    useLazy_get_Depot_By_Id_Query,
    useLazy_get_Shop_By_Id_Query,
} from '@src/redux/query/shop_RTK';
import { useLazy_get_Product_Code_By_Id_Query } from '@src/redux/query/product_RTK';

const Infor4 = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const product: Product_Field | undefined = useSelector((state: RootState) => state.Product_Edit_Slice.product);

    const create_status: 'begin' | 'end' = useSelector((state: RootState) => state.Product_Edit_Slice.create_status);

    const [product_code_ids, set__product_code_ids] = useState<string[]>([]);
    const [selected_product_code, set__selected_product_code] = useState<Product_Code_Field | null>(null);
    const [search_text_product_code, set__search_text_product_code] = useState<string>('');

    const [store_ids, set__store_ids] = useState<string[]>([]);
    const [selected_store, set__selected_store] = useState<Store_Field | null>(null);
    const [search_text_store, set__search_text_store] = useState<string>('');

    const [depot_list, set__depot_list] = useState<Depot_Field[]>([]);
    const [selected_depot, set__selected_depot] = useState<Depot_Field | undefined>(undefined);
    const limit_depot = 5;
    const [cursor_depot, set__cursor_depot] = useState<string | undefined>(undefined);
    const [next_cursor_depot, set__next_cursor_depot] = useState<string | undefined>(undefined);
    const [has_more_depot, set__has_more_depot] = useState<boolean>(true);

    const [shop_list, set__shop_list] = useState<Shop_Field[]>([]);
    const [selected_shop, set__selected_shop] = useState<Shop_Field | undefined>(undefined);
    const limit_shop = 5;
    const [cursor_shop, set__cursor_shop] = useState<string | undefined>(undefined);
    const [next_cursor_shop, set__next_cursor_shop] = useState<string | undefined>(undefined);
    const [has_more_shop, set__has_more_shop] = useState<boolean>(true);

    const [get_Product_Code_By_Id] = useLazy_get_Product_Code_By_Id_Query();
    const [get_Store_By_Id] = useLazy_get_Store_By_Id_Query();
    const [get_Depot_By_Id] = useLazy_get_Depot_By_Id_Query();
    const [get_Shop_By_Id] = useLazy_get_Shop_By_Id_Query();
    const [product_Code_Search] = useLazy_product_Code_Search_Query();
    const [store_Search] = useLazy_store_Search_Query();
    const [get_My_Shops] = useLazy_get_My_Shops_Query();
    const [get_My_Depots] = useLazy_get_My_Depots_Query();

    useEffect(() => {
        if (!product) return;
        get_Product_Code_By_Id({ id: product.product_code_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__selected_product_code(res_data.data);
                }
            })
            .catch((err) => console.error(err));
    }, [get_Product_Code_By_Id, product]);

    useEffect(() => {
        if (!product) return;
        get_Store_By_Id({ id: product.store_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__selected_store(res_data.data);
                }
            })
            .catch((err) => console.error(err));
    }, [get_Store_By_Id, product]);
    useEffect(() => {
        if (!selected_store) return;
        get_Depot_By_Id({ id: selected_store.depot_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__selected_depot(res_data.data);
                }
            })
            .catch((err) => console.error(err));
    }, [get_Depot_By_Id, selected_store]);
    useEffect(() => {
        if (!selected_depot) return;
        get_Shop_By_Id({ id: selected_depot.shop_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__selected_shop(res_data.data);
                }
            })
            .catch((err) => console.error(err));
    }, [get_Shop_By_Id, selected_depot]);

    useEffect(() => {
        if (create_status === 'begin') {
            if (!selected_product_code) return;
            dispatch(set__product_code_infor(selected_product_code));
            dispatch(set__is_product_code_infor(true));
        }
    }, [dispatch, selected_product_code, create_status]);

    useEffect(() => {
        if (create_status === 'begin') {
            if (!selected_store) return;
            dispatch(set__store_infor({ store: selected_store }));
            dispatch(set__is_store_infor(true));
        }
    }, [dispatch, selected_store, create_status]);

    useEffect(() => {
        document.addEventListener('click', () => {
            set__product_code_ids([]);
            set__store_ids([]);
        });
    }, []);

    const handle_Go_To_Create_Product_Code = () => {
        navigate(route_enum.CREATE_PRODUCT_CODE);
    };

    const handle_Product_Code_Search = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Call the API to search for product codes

        set__search_text_product_code(value);
        set__selected_product_code(null);
    };

    useEffect(() => {
        if (!selected_product_code) return;
        set__search_text_product_code(selected_product_code.name);
    }, [selected_product_code]);
    const timeout_search_product_code = useRef<any>(null);
    useEffect(() => {
        if (search_text_product_code.trim().length === 0) return;
        if (selected_product_code) return;

        clearTimeout(timeout_search_product_code.current);
        timeout_search_product_code.current = setTimeout(() => {
            if (!account_information) return;
            product_Code_Search({
                from: 0,
                size: 20,
                search_content: search_text_product_code,
                account_id: account_information.added_by_id || '', // Replace with actual account ID
            })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        const id_array: string[] = [];
                        for (let i: number = 0; i < res_data.data.hits.length; i++) {
                            id_array.push(res_data.data.hits[i]._id);
                        }
                        set__product_code_ids(id_array);
                    } else {
                        set__product_code_ids([]);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }, 1000);
    }, [search_text_product_code, account_information, product_Code_Search, selected_product_code]);

    useEffect(() => {
        if (!account_information) return;
        get_My_Shops({ cursor: cursor_shop, limit: limit_shop, account_id: account_information.added_by_id || '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    if (!cursor_shop) {
                        set__shop_list(res_data.data.items);
                    } else {
                        set__shop_list((prev) => [...prev, ...(res_data.data?.items ?? [])]);
                    }
                    set__next_cursor_shop(res_data.data?.next_cursor || undefined);
                    set__has_more_shop(res_data.data.items.length === limit_shop);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch, get_My_Shops, cursor_shop, account_information]);
    const handle_See_More_Shop = () => {
        if (!has_more_shop) return;
        if (!next_cursor_shop) return;
        set__cursor_shop(next_cursor_shop);
    };

    const handle_Selected_Shop = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const shop = shop_list.find((item) => item.id === e.target.value);
        set__selected_shop(shop);
    };

    useEffect(() => {
        if (!selected_shop) return;
        get_My_Depots({ cursor: cursor_depot, limit: limit_depot, shop_id: selected_shop?.id || '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    if (!cursor_depot) {
                        set__depot_list(res_data.data.items);
                    } else {
                        set__depot_list((prev) => [...prev, ...(res_data.data?.items ?? [])]);
                    }
                    set__next_cursor_depot(res_data.data?.next_cursor || undefined);
                    set__has_more_depot(res_data.data.items.length === limit_depot);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch, get_My_Depots, cursor_depot, selected_shop]);
    const handle_See_More_Depot = () => {
        if (!has_more_depot) return;
        if (!next_cursor_depot) return;
        set__cursor_depot(next_cursor_depot);
    };
    const handle_Selected_Depot = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const depot = depot_list.find((item) => item.id === e.target.value);
        set__selected_depot(depot);
    };

    const handle_Store_Search = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Call the API to search for product codes

        set__search_text_store(value);
        set__selected_store(null);
    };

    useEffect(() => {
        if (!selected_store) return;
        set__search_text_store(selected_store.name);
    }, [selected_store]);
    const timeout_search_store = useRef<any>(null);
    useEffect(() => {
        if (search_text_store.trim().length === 0) return;
        if (selected_store) return;

        clearTimeout(timeout_search_store.current);
        timeout_search_store.current = setTimeout(() => {
            if (!selected_depot) return;
            store_Search({
                from: 0,
                size: 20,
                search_content: search_text_store,
                depot_id: selected_depot.id,
            })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        const id_array: string[] = [];
                        for (let i: number = 0; i < res_data.data.hits.length; i++) {
                            id_array.push(res_data.data.hits[i]._id);
                        }
                        set__store_ids(id_array);
                    } else {
                        set__store_ids([]);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }, 1000);
    }, [search_text_store, selected_depot, store_Search, selected_store]);

    const list_product_code = product_code_ids.map((item, index) => {
        return <OneProductCode key={index} id={item} set__selected_product_code={set__selected_product_code} />;
    });

    const list_shop = shop_list.map((item, index) => {
        return (
            <option key={index} value={item.id}>
                {item.name}
            </option>
        );
    });

    const list_depot = depot_list.map((item, index) => {
        return (
            <option key={index} value={item.id}>
                {item.name}
            </option>
        );
    });

    const list_store = store_ids.map((item, index) => {
        return <OneStore key={index} id={item} set__selected_store={set__selected_store} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div />
                <div>Thông tin liên kết</div>
            </div>
            <div className={style.product_code}>
                <div>
                    Mã sản phẩm <span>*</span>
                </div>
                <div>
                    <div>
                        <div>
                            <input
                                value={search_text_product_code}
                                onChange={(e) => handle_Product_Code_Search(e)}
                                placeholder="Tìm kiếm mã sản phẩm"
                            />
                            <div>
                                <FaRegEye size={20} />
                            </div>
                        </div>
                        {product_code_ids.length > 0 && (
                            <div>
                                <div>{list_product_code}</div>
                            </div>
                        )}
                    </div>
                    <div>
                        <span onClick={handle_Go_To_Create_Product_Code}>Tạo mã</span>
                    </div>
                </div>
            </div>
            <div className={style.shop}>
                <div>
                    Cửa hàng <span>*</span>
                </div>
                <div>
                    <select
                        value={selected_shop?.id ?? 'Chọn cửa hàng'}
                        id="shop"
                        onChange={(e) => handle_Selected_Shop(e)}
                    >
                        <option>Chọn cửa hàng</option>
                        {list_shop}
                    </select>
                    {has_more_shop && <div onClick={() => handle_See_More_Shop()}>{SEE_MORE}</div>}
                </div>
            </div>
            <div className={style.depot}>
                <div>
                    Kho hàng <span>*</span>
                </div>
                <div>
                    <select
                        value={selected_depot?.id ?? 'Chọn kho hàng'}
                        id="depot"
                        onChange={(e) => handle_Selected_Depot(e)}
                    >
                        <option>Chọn kho hàng</option>
                        {list_depot}
                    </select>
                    {has_more_depot && <div onClick={() => handle_See_More_Depot()}>{SEE_MORE}</div>}
                </div>
            </div>
            <div className={style.store}>
                <div>
                    Gian hàng <span>*</span>
                </div>
                <div>
                    <div>
                        <div>
                            <input
                                value={search_text_store}
                                onChange={(e) => handle_Store_Search(e)}
                                placeholder="Tìm kiếm gian hàng"
                            />
                            <div>
                                <FaRegEye size={20} />
                            </div>
                        </div>
                        {store_ids.length > 0 && (
                            <div>
                                <div>{list_store}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor4);
