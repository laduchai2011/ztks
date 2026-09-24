import { memo, useEffect, useRef } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    set__is_loading,
    set__data__toast_message,
    set__is_show__create_zalo_trunk_dialog,
} from '@src/redux/slice/Oa_Setting';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Create_Zalo_Trunk_Body_Field } from '@src/data_struct/call_agent/body';
import { use_create_Zalo_Trunk_Mutation } from '@src/redux/query/call_agent_RTK';
import { messageType_enum } from '@src/component/ToastMessage/type';

const CreateZaloTrunkDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const is_show: boolean = useSelector((state: RootState) => state.Oa_Setting_Slice.create_zalo_trunk_dialog.is_show);
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const zalo_oa: Zalo_Oa_Field | undefined = useSelector(
        (state: RootState) => state.Oa_Setting_Slice.create_zalo_trunk_dialog.zalo_oa
    );

    const [create_Zalo_Trunk] = use_create_Zalo_Trunk_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show) {
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
    }, [is_show]);

    const handle_Close = () => {
        dispatch(set__is_show__create_zalo_trunk_dialog(false));
    };

    const handle_Agree = () => {
        if (!zalo_app) return;
        if (!zalo_oa) return;

        const create_zalo_trunk_body: Create_Zalo_Trunk_Body_Field = {
            trunk_code: '',
            app_id: zalo_app.app_id,
            oa_id: zalo_oa.oa_id,
            port: '',
            account_id: '',
        };

        dispatch(set__is_loading(true));
        create_Zalo_Trunk(create_zalo_trunk_body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Kích hoạt thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Kích hoạt thất bại !',
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.header}>Kích hoạt gọi điện</div>
                <div className={style.contentContainer}>Bấm đồng ý để kích hoạt</div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateZaloTrunkDialog);
