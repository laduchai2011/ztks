import { memo, useRef, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { CiSearch } from 'react-icons/ci';
import { route_enum } from '@src/router/type';
import { SEE_MORE } from '@src/const/text';
import OneProductCode from './component/OneProductCode';
import { useLazy_product_Code_Search_Query } from '@src/redux/query/product_RTK';
import { Account_Information_Field } from '@src/data_struct/account';

const Infor4 = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const [product_code_id, set__product_code_id] = useState<string[]>([]);

    const [product_Code_Search] = useLazy_product_Code_Search_Query();

    const handle_Selected_Product_Code = () => {};

    const handle_Go_To_Create_Product_Code = () => {
        navigate(route_enum.CREATE_PRODUCT_CODE);
    };

    const timeout = useRef<any>(null);
    const handle_Product_Code_Search = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        // Call the API to search for product codes

        if (value.length === 0) return;

        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            if (!account_information) return;
            product_Code_Search({
                from: 0,
                size: 20,
                search_content: value,
                account_id: account_information.added_by_id || '', // Replace with actual account ID
            })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        const id_array: string[] = [];
                        for (let i: number = 0; i < res_data.data.hits.length; i++) {
                            id_array.push(res_data.data.hits[i]._id);
                        }
                        set__product_code_id(id_array);
                    } else {
                        set__product_code_id([]);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }, 1000);
    };

    const list_product_code = product_code_id.map((item, index) => {
        return <OneProductCode key={index} id={item} />;
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
                            <input onChange={(e) => handle_Product_Code_Search(e)} placeholder="Tìm kiếm mã sản phẩm" />
                            <div>
                                <CiSearch size={20} />
                            </div>
                        </div>
                        <div>
                            <div>{list_product_code}</div>
                            {/* <div>
                                <div>{SEE_MORE}</div>
                            </div> */}
                        </div>
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
                    <select value={'Chọn cửa hàng'} id="product_code" onChange={handle_Selected_Product_Code}>
                        <option>Chọn cửa hàng</option>
                        <option>Cửa hàng 1</option>
                        <option>Cửa hàng 2</option>
                    </select>
                </div>
            </div>
            <div className={style.depot}>
                <div>
                    Kho hàng <span>*</span>
                </div>
                <div>
                    <select value={'Chọn kho hàng'} id="product_code" onChange={handle_Selected_Product_Code}>
                        <option>Chọn kho hàng</option>
                        <option>Kho hàng 1</option>
                        <option>Kho hàng 2</option>
                    </select>
                </div>
            </div>
            <div className={style.store}>
                <div>
                    Gian hàng <span>*</span>
                </div>
                <div>
                    <select value={'Chọn gian hàng'} id="product_code" onChange={handle_Selected_Product_Code}>
                        <option>Chọn gian hàng</option>
                        <option>Gian hàng 1</option>
                        <option>Gian hàng 2</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor4);
