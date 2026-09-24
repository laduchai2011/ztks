import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { CiEdit } from 'react-icons/ci';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';
import { MdOutlineWifiCalling } from 'react-icons/md';
import { GoDotFill } from 'react-icons/go';
import { use_get_Zalo_Oa_With_Id_Query } from '@src/redux/query/zalo_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import {
    set__zalo_oa,
    set__is_loading,
    set__data__toast_message,
    set__is_show__take_token_dialog,
    set__zalo_oa__take_token_dialog,
    set__is_show__edit_zalo_oa,
    set__zalo_oa__edit_zalo_oa,
    set__new_zalo_oa__edit_zalo_oa,
    set__is_show__create_zalo_trunk_dialog,
    set__zalo_oa__create_zalo_trunk_dialog,
} from '@src/redux/slice/Oa_Setting';
import { messageType_enum } from '@src/component/ToastMessage/type';

const MyOa = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const zalo_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Oa_Setting_Slice.zalo_oa);
    const new_zalo_oa: Zalo_Oa_Field | undefined = useSelector(
        (state: RootState) => state.Oa_Setting_Slice.edit_zalo_oa.new_zalo_oa
    );

    const [is_show_id, set__is_show_id] = useState(false);
    const [is_show_secret, set__is_show_secret] = useState(false);

    const {
        data: data__zalo_oa,
        // isFetching,
        isLoading: is_loading__zalo_oa,
        isError: is_error__zalo_oa,
        error: error__zalo_oa,
    } = use_get_Zalo_Oa_With_Id_Query(
        { id: id || '', account_id: account_information?.added_by_id || '' },
        { skip: id === undefined || account_information === undefined }
    );
    useEffect(() => {
        if (is_error__zalo_oa && error__zalo_oa) {
            console.error(error__zalo_oa);
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.SUCCESS,
                    message: 'Lấy dữ liệu OA KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, is_error__zalo_oa, error__zalo_oa]);
    useEffect(() => {
        dispatch(set__is_loading(is_loading__zalo_oa));
    }, [dispatch, is_loading__zalo_oa]);
    useEffect(() => {
        const res_data = data__zalo_oa;
        if (res_data?.is_success && res_data.data) {
            dispatch(set__zalo_oa(res_data.data));
        }
    }, [dispatch, data__zalo_oa]);

    useEffect(() => {
        if (!new_zalo_oa) return;
        dispatch(set__zalo_oa(new_zalo_oa));
        dispatch(set__new_zalo_oa__edit_zalo_oa(undefined));
    }, [dispatch, new_zalo_oa]);

    const handle_Show_Id = (is_show: boolean) => {
        set__is_show_id(is_show);
    };

    const handle_Show_Secret = (is_show: boolean) => {
        set__is_show_secret(is_show);
    };

    const handle_Open_Take_Token = () => {
        dispatch(set__is_show__take_token_dialog(true));
        dispatch(set__zalo_oa__take_token_dialog(zalo_oa));
    };

    const handle_Open_Edit = () => {
        dispatch(set__is_show__edit_zalo_oa(true));
        dispatch(set__zalo_oa__edit_zalo_oa(zalo_oa));
    };

    const handle_Open_Create_Zalo_Trunk = () => {
        dispatch(set__is_show__create_zalo_trunk_dialog(true));
        dispatch(set__zalo_oa__create_zalo_trunk_dialog(zalo_oa));
    };

    return (
        <div className={style.parent}>
            <div>
                <div className={style.label}>{zalo_oa?.label}</div>
                <div>
                    <div>
                        <div>Tên OA</div>
                        <div>{zalo_oa?.oa_name}</div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <div>Định danh OA</div>
                            <div>
                                {is_show_id && <FaRegEye onClick={() => handle_Show_Id(false)} />}
                                {!is_show_id && <FaEyeSlash onClick={() => handle_Show_Id(true)} />}
                            </div>
                        </div>
                        <div>
                            {is_show_id && <div>{zalo_oa?.oa_id}</div>}
                            {!is_show_id && (
                                <div>
                                    <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <div>Khóa OA</div>
                            <div>
                                {is_show_secret && <FaRegEye onClick={() => handle_Show_Secret(false)} />}
                                {!is_show_secret && <FaEyeSlash onClick={() => handle_Show_Secret(true)} />}
                            </div>
                        </div>
                        <div>
                            {is_show_secret && <div>{zalo_oa?.oa_secret}</div>}
                            {!is_show_secret && (
                                <div>
                                    <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={style.btnContainer}>
                    <div className={style.refresh} onClick={() => handle_Open_Take_Token()}>
                        Lấy token mới
                    </div>
                    <CiEdit onClick={() => handle_Open_Edit()} size={30} color="green" />
                    <MdOutlineWifiCalling onClick={() => handle_Open_Create_Zalo_Trunk()} size={25} color="red" />
                </div>
                <div className={style.warn}>Thông tin không được để lộ</div>
            </div>
        </div>
    );
};

export default memo(MyOa);
