import { memo, useEffect, useRef } from 'react';
import style from './style.module.scss';
// import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { AGREE, EXIT, CLOSE } from '@src/const/text';
import { connectSip } from '../../call';
import { setIsShow_callDialog } from '@src/redux/slice/MessageV1';
import { useLazyGetMccInfoQuery, useRequestConsentMutation, useOutboundMutation } from '@src/redux/query/callRTK';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { CallTypeEnum } from '@src/dataStruct/call';

const CallDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.MessageV1Slice.zaloOa);
    const isShow: boolean = useSelector((state: RootState) => state.MessageV1Slice.callDialog.isShow);

    const [requestConsent] = useRequestConsentMutation();
    const [getMccInfo] = useLazyGetMccInfoQuery();
    const [outbound] = useOutboundMutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
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
    }, [isShow]);

    useEffect(() => {
        connectSip();
    }, []);

    const handleClose = () => {
        dispatch(setIsShow_callDialog(false));
    };

    const handleRequestConsent = () => {
        if (!zaloApp) return;
        if (!zaloOa) return;

        requestConsent({
            phone: '84789860854',
            call_type: CallTypeEnum.AUDIO,
            reason_code: 101,
            zaloApp: zaloApp,
            zaloOa: zaloOa,
            accountId: -1,
        })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleGetAgent = () => {
        if (!zaloApp) return;
        if (!zaloOa) return;

        getMccInfo({
            zaloApp: zaloApp,
            zaloOa: zaloOa,
            accountId: -1,
        })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleOutbound = () => {
        if (!zaloApp) return;
        if (!zaloOa) return;

        // outbound({
        //     phone: '84789860854',
        //     call_type: CallTypeEnum.AUDIO,
        //     reason_code: 101,
        //     zaloApp: zaloApp,
        //     zaloOa: zaloOa,
        //     accountId: -1,
        // })
        //     .then((res) => {
        //         console.log(res);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //     });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <button onClick={() => handleRequestConsent()}>Xin cấp quyền gọi</button>
                    <button onClick={() => handleGetAgent()}>Lấy agent</button>
                    <button onClick={() => handleOutbound()}>Tạo link cuộc gọi</button>
                </div>
                <div className={style.buttonContainer}>
                    <button>{AGREE}</button>
                    <button>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(CallDialog);
