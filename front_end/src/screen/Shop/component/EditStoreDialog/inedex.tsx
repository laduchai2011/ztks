import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, SHOP, EDIT } from '@src/const/text';
import TextEditor from '@src/component/TextEditor';
import { Edit_Store_Body_Field } from '@src/data_struct/shop/body';
import { use_edit_Store_Mutation } from '@src/redux/query/shop_RTK';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_edit_store, set__edited_store } from '@src/redux/slice/Shop';
import { Shop_Field, Depot_Field, Store_Field } from '@src/data_struct/shop';

const EditStoreDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const selected_shop: Shop_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.selected_shop);
    const selected_depot: Depot_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.selected_depot);
    const is_show_edit_store: boolean = useSelector((state: RootState) => state.Shop_Slice.is_show_edit_store);
    const selected_edit_store: Store_Field | undefined = useSelector(
        (state: RootState) => state.Shop_Slice.selected_edit_store
    );

    const [edit_store, set__edit_store] = useState<Edit_Store_Body_Field>({
        id: '',
        name: '',
        description: '',
        content: '',
        account_id: '',
    });
    const [content_1, set__content_1] = useState<string>('');

    const [edit_Store] = use_edit_Store_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_edit_store) {
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
    }, [is_show_edit_store]);

    useEffect(() => {
        if (!selected_edit_store) return;
        const _edit_store: Edit_Store_Body_Field = {
            id: selected_edit_store.id,
            name: selected_edit_store.name,
            description: selected_edit_store.description,
            content: selected_edit_store.content,

            account_id: '',
        };
        set__edit_store(_edit_store);
        set__content_1(selected_edit_store.content);
    }, [selected_edit_store]);

    const handle_Close = () => {
        dispatch(set__is_show_edit_store(false));
    };

    const handle_Edit_Store = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        switch (type) {
            case 'name': {
                set__edit_store((prev) => ({
                    ...prev,
                    name: value,
                }));
                break;
            }
            case 'description': {
                set__edit_store((prev) => ({
                    ...prev,
                    description: value,
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
        set__edit_store((prev) => ({
            ...prev,
            content: value,
        }));
    };

    const handle_Edit = () => {
        if (!selected_shop) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Vui lòng chọn 1 cửa hàng !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        if (!selected_depot) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Vui lòng chọn 1 kho !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        if (edit_store.name.trim().length === 0) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Vui lòng nhập tên gian hàng !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        const body: Edit_Store_Body_Field = {
            id: edit_store.id,
            name: edit_store.name.trim(),
            description: edit_store.description.trim(),
            content: edit_store.content.trim(),
            account_id: '',
        };

        dispatch(global_set__is_loading(true));
        edit_Store(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__edited_store(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Chỉnh sửa gian hàng thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                    dispatch(set__is_show_edit_store(false));
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Chỉnh sửa gian hàng không thành công !',
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
                    <div>Chỉnh sửa gian hàng</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}>
                    <div>
                        <div>
                            <div className={style.input1}>
                                <input
                                    value={edit_store.name}
                                    onChange={(e) => handle_Edit_Store('name', e)}
                                    placeholder="Tên của hàng"
                                    maxLength={50}
                                />
                            </div>
                            <div className={style.input1}>
                                <input
                                    value={edit_store.description}
                                    onChange={(e) => handle_Edit_Store('description', e)}
                                    placeholder="Diễn tả"
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
                            <div>{`Bạn chỉnh sửa gian hàng của kho (${selected_depot?.name}) cho cửa hàng (${selected_shop?.name})`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(EditStoreDialog);
