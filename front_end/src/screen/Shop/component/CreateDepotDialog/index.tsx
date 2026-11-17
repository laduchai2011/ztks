import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, SHOP, CREATE } from '@src/const/text';
import TextEditor from '@src/component/TextEditor';
import { Create_Depot_Body_Field } from '@src/data_struct/shop/body';
import { use_create_Depot_Mutation } from '@src/redux/query/shop_RTK';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_create_depot, set__new_depot } from '@src/redux/slice/Shop';
import { Shop_Field } from '@src/data_struct/shop';

const CreateDepotDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const selected_shop: Shop_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.selected_shop);
    const is_show_create_depot: boolean = useSelector((state: RootState) => state.Shop_Slice.is_show_create_depot);

    const [create_depot, set__create_depot] = useState<Create_Depot_Body_Field>({
        name: '',
        description: '',
        content: '',
        address: '',
        phone: '',
        shop_id: '',
        account_id: '',
    });

    const [create_Depot] = use_create_Depot_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_create_depot) {
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
    }, [is_show_create_depot]);

    const handle_Close = () => {
        dispatch(set__is_show_create_depot(false));
    };

    const handle_Create_Depot = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        switch (type) {
            case 'name': {
                set__create_depot((prev) => ({
                    ...prev,
                    name: value,
                }));
                break;
            }
            case 'description': {
                set__create_depot((prev) => ({
                    ...prev,
                    description: value,
                }));
                break;
            }
            case 'address': {
                set__create_depot((prev) => ({
                    ...prev,
                    address: value,
                }));
                break;
            }
            case 'phone': {
                set__create_depot((prev) => ({
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
        set__create_depot((prev) => ({
            ...prev,
            content: value,
        }));
    };

    const handle_Create = () => {
        if (!selected_shop) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Vui lòng chọn 1 cửa hàng !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        if (create_depot.name.trim().length === 0) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Vui lòng nhập tên kho !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        const body: Create_Depot_Body_Field = {
            name: create_depot.name.trim(),
            description: create_depot.description.trim(),
            content: create_depot.content.trim(),
            address: create_depot.address.trim(),
            phone: create_depot.phone.trim(),
            shop_id: selected_shop.id,
            account_id: '',
        };

        dispatch(global_set__is_loading(true));
        create_Depot(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__new_depot(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Tạo cửa hàng mới thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                    dispatch(set__is_show_create_depot(false));
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
                    <div>Tạo kho</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}>
                    <div>
                        <div>
                            <div className={style.input1}>
                                <input
                                    value={create_depot.name}
                                    onChange={(e) => handle_Create_Depot('name', e)}
                                    placeholder="Tên kho"
                                    maxLength={50}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={create_depot.description}
                                    onChange={(e) => handle_Create_Depot('description', e)}
                                    placeholder="Diễn tả"
                                    maxLength={255}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={create_depot.address}
                                    onChange={(e) => handle_Create_Depot('address', e)}
                                    placeholder="Địa chỉ"
                                    maxLength={255}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={create_depot.phone}
                                    onChange={(e) => handle_Create_Depot('phone', e)}
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
                            <div>{SHOP}</div>
                        </div>
                        <div className={style.content}>
                            <div>{`Bạn đang tạo kho cho cửa hàng (${selected_shop?.name})`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateDepotDialog);
