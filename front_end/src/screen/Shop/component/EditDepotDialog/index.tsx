import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, SHOP, EDIT } from '@src/const/text';
import TextEditor from '@src/component/TextEditor';
import { Edit_Depot_Body_Field } from '@src/data_struct/shop/body';
import { use_edit_Depot_Mutation } from '@src/redux/query/shop_RTK';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_edit_depot, set__edited_depot } from '@src/redux/slice/Shop';
import { Shop_Field, Depot_Field } from '@src/data_struct/shop';

const EditShopDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const selected_shop: Shop_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.selected_shop);
    const is_show_edit_depot: boolean = useSelector((state: RootState) => state.Shop_Slice.is_show_edit_depot);
    const selected_edit_depot: Depot_Field | undefined = useSelector(
        (state: RootState) => state.Shop_Slice.selected_edit_depot
    );

    const [edit_depot, set__edit_depot] = useState<Edit_Depot_Body_Field>({
        id: '',
        name: '',
        description: '',
        content: '',
        address: '',
        phone: '',
        account_id: '',
    });
    const [content_1, set__content_1] = useState<string>('');

    const [edit_Depot] = use_edit_Depot_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_edit_depot) {
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
    }, [is_show_edit_depot]);

    useEffect(() => {
        if (!selected_edit_depot) return;
        const _edit_depot: Edit_Depot_Body_Field = {
            id: selected_edit_depot.id,
            name: selected_edit_depot.name,
            description: selected_edit_depot.description,
            content: selected_edit_depot.content,
            address: selected_edit_depot.address,
            phone: selected_edit_depot.phone,
            account_id: '',
        };
        set__edit_depot(_edit_depot);
        set__content_1(selected_edit_depot.content);
    }, [selected_edit_depot]);

    const handle_Close = () => {
        dispatch(set__is_show_edit_depot(false));
    };

    const handle_Edit_Depot = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        switch (type) {
            case 'name': {
                set__edit_depot((prev) => ({
                    ...prev,
                    name: value,
                }));
                break;
            }
            case 'description': {
                set__edit_depot((prev) => ({
                    ...prev,
                    description: value,
                }));
                break;
            }
            case 'address': {
                set__edit_depot((prev) => ({
                    ...prev,
                    address: value,
                }));
                break;
            }
            case 'phone': {
                set__edit_depot((prev) => ({
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
        set__edit_depot((prev) => ({
            ...prev,
            content: value,
        }));
    };

    const handle_Edit = () => {
        if (edit_depot.name.trim().length === 0) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Vui lòng nhập tên kho !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        const body: Edit_Depot_Body_Field = {
            id: edit_depot.id,
            name: edit_depot.name.trim(),
            description: edit_depot.description.trim(),
            content: edit_depot.content.trim(),
            address: edit_depot.address.trim(),
            phone: edit_depot.phone.trim(),
            account_id: edit_depot.account_id,
        };
        dispatch(global_set__is_loading(true));
        edit_Depot(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__edited_depot(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Thay đổi thông tin kho thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                    dispatch(set__is_show_edit_depot(false));
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Thay đổi thông tin kho không thành công !',
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
                    <div>Thay đổi thông tin kho</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}>
                    <div>
                        <div>
                            <div className={style.input1}>
                                <input
                                    value={edit_depot.name}
                                    onChange={(e) => handle_Edit_Depot('name', e)}
                                    placeholder="Tên của hàng"
                                    maxLength={50}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={edit_depot.description}
                                    onChange={(e) => handle_Edit_Depot('description', e)}
                                    placeholder="Diễn tả"
                                    maxLength={255}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={edit_depot.address}
                                    onChange={(e) => handle_Edit_Depot('address', e)}
                                    placeholder="Địa chỉ"
                                    maxLength={255}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={edit_depot.phone}
                                    onChange={(e) => handle_Edit_Depot('phone', e)}
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
                            <div>{SHOP}</div>
                        </div>
                        <div className={style.content}>
                            <div>{`Bạn đang chỉnh sửa thông tin kho (${selected_edit_depot?.name}) cho cửa hàng (${selected_shop?.name})`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(EditShopDialog);
