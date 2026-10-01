import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, PAY, EDIT } from '@src/const/text';
import TextEditor from '@src/component/TextEditor';
import { Edit_Shop_Body_Field } from '@src/data_struct/shop/body';
import { use_edit_Shop_Mutation } from '@src/redux/query/shop_RTK';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_edit_shop, set__edited_shop } from '@src/redux/slice/Shop';
import { Shop_Field } from '@src/data_struct/shop';

const EditShopDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const is_show_edit_shop: boolean = useSelector((state: RootState) => state.Shop_Slice.is_show_edit_shop);
    const selected_edit_shop: Shop_Field | undefined = useSelector(
        (state: RootState) => state.Shop_Slice.selected_edit_shop
    );

    const [edit_shop, set__edit_shop] = useState<Edit_Shop_Body_Field>({
        id: '',
        name: '',
        description: '',
        content: '',
        address: '',
        phone: '',
        account_id: '',
    });
    const [content_1, set__content_1] = useState<string>('');

    const [edit_Shop] = use_edit_Shop_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_edit_shop) {
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
    }, [is_show_edit_shop]);

    useEffect(() => {
        if (!selected_edit_shop) return;
        const _edit_shop: Edit_Shop_Body_Field = {
            id: selected_edit_shop.id,
            name: selected_edit_shop.name,
            description: selected_edit_shop.description,
            content: selected_edit_shop.content,
            address: selected_edit_shop.address,
            phone: selected_edit_shop.phone,
            account_id: selected_edit_shop.account_id,
        };
        set__edit_shop(_edit_shop);
        set__content_1(selected_edit_shop.content);
    }, [selected_edit_shop]);

    const handle_Close = () => {
        dispatch(set__is_show_edit_shop(false));
    };

    const handle_Edit_Shop = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        switch (type) {
            case 'name': {
                set__edit_shop((prev) => ({
                    ...prev,
                    name: value,
                }));
                break;
            }
            case 'description': {
                set__edit_shop((prev) => ({
                    ...prev,
                    description: value,
                }));
                break;
            }
            case 'address': {
                set__edit_shop((prev) => ({
                    ...prev,
                    address: value,
                }));
                break;
            }
            case 'phone': {
                set__edit_shop((prev) => ({
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
        set__edit_shop((prev) => ({
            ...prev,
            content: value,
        }));
    };

    const handle_Edit = () => {
        if (edit_shop.name.trim().length === 0) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Vui lòng nhập tên cửa hàng !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        const body: Edit_Shop_Body_Field = {
            id: edit_shop.id,
            name: edit_shop.name.trim(),
            description: edit_shop.description.trim(),
            content: edit_shop.content.trim(),
            address: edit_shop.address.trim(),
            phone: edit_shop.phone.trim(),
            account_id: edit_shop.account_id,
        };
        dispatch(global_set__is_loading(true));
        edit_Shop(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__edited_shop(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Thay đổi thông tin cửa hàng thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                    dispatch(set__is_show_edit_shop(false));
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Thay đổi thông tin cửa hàng không thành công !',
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
                    <div>Thay đổi thông tin cửa hàng</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}>
                    <div>
                        <div>
                            <div className={style.input1}>
                                <input
                                    value={edit_shop.name}
                                    onChange={(e) => handle_Edit_Shop('name', e)}
                                    placeholder="Tên của hàng"
                                    maxLength={50}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={edit_shop.description}
                                    onChange={(e) => handle_Edit_Shop('description', e)}
                                    placeholder="Diễn tả"
                                    maxLength={255}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={edit_shop.address}
                                    onChange={(e) => handle_Edit_Shop('address', e)}
                                    placeholder="Địa chỉ"
                                    maxLength={255}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={edit_shop.phone}
                                    onChange={(e) => handle_Edit_Shop('phone', e)}
                                    placeholder="Số điện thoại"
                                    maxLength={255}
                                />
                            </div>
                            <div className={style.input1}>
                                <TextEditor value={content_1} onChange={(value) => handle_Content(value)} />
                            </div>
                            <div className={style.btn1}>
                                <div onClick={() => handle_Edit()}>{EDIT}</div>
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

export default memo(EditShopDialog);
