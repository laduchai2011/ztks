import { FC, memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { TiTick } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';
import {
    Call_Type_Enum,
    Call_Type_Type,
    Call_In_State_Type,
    Call_Out_State_Type,
    Call_In_State_Enum,
    Call_Out_State_Enum,
} from '@src/data_struct/call';
import { useLazy_check_Consent_Query } from '@src/redux/query/call_RTK';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';

const Infor: FC<{
    set__is_request_consent: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ set__is_request_consent }) => {
    // const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const zalo_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Message_V1_Slice.zalo_oa);

    const call_in_state__call_dialog: Call_In_State_Type = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.call_in_state
    );
    const call_out_state__call_dialog: Call_Out_State_Type = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.call_out_state
    );

    const [selected_call_type, set__selected_call_type] = useState<Call_Type_Type>(Call_Type_Enum.AUDIO);
    const [expried_time, set__expried_time] = useState<string>('');
    const [is_ringing, set__is_ringing] = useState<boolean>(false);

    const [check_Consent] = useLazy_check_Consent_Query();

    useEffect(() => {
        if (!zalo_app) return;
        if (!zalo_oa) return;

        check_Consent({
            phone: '84789860854',
            zalo_app: zalo_app,
            zalo_oa: zalo_oa,
            account_id: '',
        })
            .then((res) => {
                const res_data = res.data;
                // console.log('checkConsent resData', resData);
                if (res_data?.is_success && res_data.data) {
                    const _expired_time = res_data.data.data.expired_time;
                    const _expired_date = new Date(_expired_time);
                    set__expried_time(_expired_date.toLocaleString('vi-VN'));
                }
            })
            .catch((err) => console.error('checkConsent err', err));
    }, [check_Consent, zalo_app, zalo_oa]);

    useEffect(() => {
        if (
            call_in_state__call_dialog === Call_In_State_Enum.RINGING ||
            call_out_state__call_dialog === Call_Out_State_Enum.RINGING
        ) {
            set__is_ringing(true);
        } else {
            set__is_ringing(false);
        }
    }, [call_in_state__call_dialog, call_out_state__call_dialog]);

    const handle_Open_Request_Consent = () => {
        set__is_request_consent(true);
    };

    const handle_Class_Name_Selected_Call_Type = (call_type: Call_Type_Type) => {
        // if (selectedCallType === callType) {
        //     return style.selected;
        // }
        if (Call_Type_Enum.AUDIO === call_type) {
            return style.selected;
        }
    };

    const handle_Select_Call_Type = (call_type: Call_Type_Type) => {
        set__selected_call_type(call_type);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.consents}>
                <div>
                    <div
                        className={handle_Class_Name_Selected_Call_Type(Call_Type_Enum.AUDIO)}
                        onClick={() => handle_Select_Call_Type(Call_Type_Enum.AUDIO)}
                    >
                        <div>Audio</div>
                        <TiTick size={20} color="greenyellow" />
                    </div>
                    <div
                        className={handle_Class_Name_Selected_Call_Type(Call_Type_Enum.AUDIO_AND_VIDEO)}
                        onClick={() => handle_Select_Call_Type(Call_Type_Enum.AUDIO_AND_VIDEO)}
                    >
                        <div>Audio and video</div>
                        <IoClose size={20} color="red" />
                    </div>
                </div>
            </div>
            {!is_ringing && <div className={style.time}>{`Hạn đến ${expried_time}`}</div>}
            {!is_ringing && (
                <div className={style.requestContent}>
                    <div onClick={() => handle_Open_Request_Consent()}>Gửi yêu cầu cấp quyền gọi</div>
                </div>
            )}
        </div>
    );
};

export default memo(Infor);
