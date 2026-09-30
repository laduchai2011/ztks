import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, PAY, CREATE } from '@src/const/text';
import TextEditor from '@src/component/TextEditor';
import { Create_Shop_Body_Field } from '@src/data_struct/shop/body';
import { use_create_Shop_Mutation } from '@src/redux/query/shop_RTK';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_create_shop, add__new_shop } from '@src/redux/slice/Shop';

const CreateShopDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const is_show_create_shop: boolean = useSelector((state: RootState) => state.Shop_Slice.is_show_create_shop);

    const [create_shop, set__create_shop] = useState<Create_Shop_Body_Field>({
        name: '',
        description: '',
        content: '',
        address: '',
        phone: '',
        account_id: '',
    });

    const [create_Shop] = use_create_Shop_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_create_shop) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [is_show_create_shop]);

    const handle_Close = () => {
        dispatch(set__is_show_create_shop(false));
    };

    const handle_Create_shop = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        switch (type) {
            case 'name': {
                set__create_shop((prev) => ({
                    ...prev,
                    name: value,
                }));
                break;
            }
            case 'description': {
                set__create_shop((prev) => ({
                    ...prev,
                    description: value,
                }));
                break;
            }
            case 'address': {
                set__create_shop((prev) => ({
                    ...prev,
                    address: value,
                }));
                break;
            }
            case 'phone': {
                set__create_shop((prev) => ({
                    ...prev,
                    phone: value,
                }));
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    };

    const handle_Content = (value: string) => {
        set__create_shop((prev) => ({
            ...prev,
            content: value,
        }));
    };

    const handle_Create = () => {
        const body: Create_Shop_Body_Field = {
            name: create_shop.name.trim(),
            description: create_shop.description.trim(),
            content: create_shop.content.trim(),
            address: create_shop.address.trim(),
            phone: create_shop.phone.trim(),
            account_id: '',
        };

        dispatch(global_set__is_loading(true));
        create_Shop(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(add__new_shop(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Tạo cửa hàng mới thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                    dispatch(set__is_show_create_shop(false));
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Tạo cửa hàng mới không thành công !',
                            type: messageType_enum.WARN,
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    global_set__data__toast_message({
                        message: 'Đã có lỗi xảy ra !',
                        type: messageType_enum.ERROR,
                    })
                );
            })
            .finally(() => {
                dispatch(global_set__is_loading(false));
            });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>Tạo cửa hàng</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}>
                    <div>
                        <div>
                            <div className={style.input1}>
                                <input
                                    value={create_shop.name}
                                    onChange={(e) => handle_Create_shop('name', e)}
                                    placeholder="Tên của hàng"
                                    maxLength={50}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={create_shop.description}
                                    onChange={(e) => handle_Create_shop('description', e)}
                                    placeholder="Diễn tả"
                                    maxLength={255}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={create_shop.address}
                                    onChange={(e) => handle_Create_shop('address', e)}
                                    placeholder="Địa chỉ"
                                    maxLength={255}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={create_shop.phone}
                                    onChange={(e) => handle_Create_shop('phone', e)}
                                    placeholder="Số điện thoại"
                                    maxLength={255}
                                />
                            </div>
                            <div className={style.input1}>
                                <TextEditor onChange={(value) => handle_Content(value)} />
                            </div>
                            <div className={style.btn1}>
                                <div onClick={() => handle_Create()}>{CREATE}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={style.header}>
                            <div>{PAY}</div>
                        </div>
                        <div className={style.content}>
                            <div>Tặng miễn phí 1 tháng sử dụng khi khởi tạo</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateShopDialog);
